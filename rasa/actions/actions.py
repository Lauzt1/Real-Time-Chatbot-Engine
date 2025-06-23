import os, re, datetime, certifi
from pymongo import MongoClient
from bson import ObjectId, DBRef, Decimal128
from dotenv import load_dotenv
from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

# Connect to MongoDB
client = MongoClient(
    os.getenv("MONGODB_URI"),
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=True
)
db = client[os.getenv("DB_NAME", client.get_default_database().name)]


def bson_to_json(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, DBRef):
        return {"$ref": obj.collection, "$id": str(obj.id)}
    if isinstance(obj, Decimal128):
        return float(obj.to_decimal())
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: bson_to_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [bson_to_json(v) for v in obj]
    return obj

class ActionNoop(Action):
    def name(self) -> Text:
        return "action_noop"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[SlotSet]:
        return []

class ActionProductInfo(Action):
    def name(self) -> Text:
        return "action_product_info"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[SlotSet]:
        # Use raw user message to match against name or code
        user_msg = tracker.latest_message.get("text", "").lower()
        # search only in the three product collections
        for coll in ["polishers", "pads", "compounds"]:
            for doc in db[coll].find():
                name = doc.get("name", "").lower()
                code = doc.get("code", "").lower()
                if (name and re.search(rf"\b{re.escape(name)}\b", user_msg)) or \
                   (code and re.search(rf"\b{re.escape(code)}\b", user_msg)):
                    serial = bson_to_json(doc)
                    # utter description
                    dispatcher.utter_message(serial.get("description", "No description."))
                    # set context slots
                    return [
                        SlotSet("product_doc", serial),
                        SlotSet("product_id", str(doc.get("_id"))),
                        SlotSet("product_category", coll),
                        SlotSet("product_model", name),
                        SlotSet("page", None),
                    ]
        dispatcher.utter_message("Sorry, I couldn’t find that product.")
        return []

class ActionSetProductContext(Action):
    def name(self) -> Text:
        return "action_set_product_context"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[SlotSet]:
        page = tracker.get_slot("page") or ""
        m = re.match(r"^/product/(?P<cat>[^/]+)/(?P<id>[0-9a-f]{24})$", page)
        if not m:
            return []
        cat, pid = m.group("cat"), m.group("id")
        doc = db[cat].find_one({"_id": ObjectId(pid)}) or {}
        serial = bson_to_json(doc)
        return [
            SlotSet("product_category", cat),
            SlotSet("product_id", pid),
            SlotSet("product_doc", serial),
        ]

class ActionQueryProductAttribute(Action):
    def name(self) -> Text:
        return "action_query_product_attribute"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[SlotSet]:
        intent = tracker.get_intent_of_latest_message()
        doc = tracker.get_slot("product_doc") or {}

        # map intents to doc fields
        attr_map = {
            "ask_description":  ("description", ""),
            "ask_weight":       ("weight", " kg"),
            "ask_power":        ("power", " W"),
            "ask_orbit":        ("orbit", " mm"),
            "ask_backingpad":   ("backingpad", ""),  # field is 'backingpad' in DB
            "ask_size":         ("size", ""),
            "ask_code":         ("code", ""),
            "ask_colour":       ("colour", ""),
        }

        if intent not in attr_map:
            dispatcher.utter_message("Sorry, I’m not sure what you want to know.")
            return []

        field, unit = attr_map[intent]
        value = doc.get(field)
        name = doc.get("name", "This product")

        if value is None:
            dispatcher.utter_message("I don’t have that detail right now.")
        else:
            dispatcher.utter_message(f"**{name}** {field} is {value}{unit}.")

        return []
