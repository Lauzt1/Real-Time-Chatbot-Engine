import os, re, datetime, certifi
from pymongo import MongoClient
from bson import ObjectId, DBRef, Decimal128
from dotenv import load_dotenv
from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import (
    SessionStarted,
    ActionExecuted,
    SlotSet,
)

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

    def run(
            self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[SlotSet]:
        """
        Looks up a product by name or code, utters its description,
        and provides a direct link to the product page.
        """
        user_msg = tracker.latest_message.get("text", "").lower()
        base_url = "http://localhost:3000/product"

        # Search across all product collections
        for coll in ["polishers", "pads", "compounds"]:
            for doc in db[coll].find():
                name_lower = doc.get("name", "").lower()
                code_lower = doc.get("code", "").lower()
                if (name_lower and re.search(rf"\b{re.escape(name_lower)}\b", user_msg)) or \
                   (code_lower and re.search(rf"\b{re.escape(code_lower)}\b", user_msg)):
                    serial = bson_to_json(doc)
                    product_id = str(doc.get("_id"))
                    # use singular route (drop the trailing 's')
                    route = coll[:-1]
                    product_link = f"{base_url}/{route}/{product_id}"

                    # Send description and link
                    dispatcher.utter_message(text=serial.get("description", "No description available."))
                    dispatcher.utter_message(text=f"View full details here: {product_link}")

                    # Set context slots for follow-up
                    return [
                        SlotSet("product_doc", serial),
                        SlotSet("product_id", product_id),
                        SlotSet("product_category", coll),
                        SlotSet("product_model", name_lower),
                    ]

        dispatcher.utter_message(text="Sorry, I couldn’t find that product.")
        return []
    
class ActionProductLink(Action):
    def name(self) -> Text:
        return "action_product_link"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[SlotSet]:

        user_msg = tracker.latest_message.get("text", "").lower()
        base_url = "http://localhost:3000/product"

        for coll in ["polishers", "pads", "compounds"]:
            for doc in db[coll].find():
                name = doc.get("name", "").lower()
                code = doc.get("code", "").lower()
                if (name and re.search(rf"\b{re.escape(name)}\b", user_msg)) or \
                   (code and re.search(rf"\b{re.escape(code)}\b", user_msg)):
                    product_id = str(doc.get("_id"))
                    # singular route
                    route = coll[:-1]
                    link = f"{base_url}/{route}/{product_id}"
                    dispatcher.utter_message(f"You can view it here: {link}")
                    return [
                        SlotSet("product_doc", bson_to_json(doc)),
                        SlotSet("product_id", product_id),
                        SlotSet("product_category", coll),
                        SlotSet("product_model", name),
                    ]

        dispatcher.utter_message("Sorry, I couldn’t find the product link.")
        return []

class ActionSetProductContext(Action):
    def name(self) -> Text:
        return "action_set_product_context"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[SlotSet]:
        page = tracker.get_slot("page") or ""
        m = re.match(r"^/product/(?P<cat>[^/]+)/(?P<id>[0-9a-f]{24})$", page)
        if not m:
            return []

        raw_cat, pid = m.group("cat"), m.group("id")

        # normalize URL segment to your Mongo collections
        if raw_cat in ["polishers", "pads", "compounds"]:
            coll = raw_cat
        elif raw_cat + "s" in ["polishers", "pads", "compounds"]:
            coll = raw_cat + "s"
        else:
            return []

        # fetch the document
        doc = db[coll].find_one({"_id": ObjectId(pid)}) or {}
        serial = bson_to_json(doc)

        return [
            SlotSet("product_category", coll),
            SlotSet("product_id", pid),
            SlotSet("product_doc", serial),
        ]

class ActionQueryProductAttribute(Action):
    def name(self) -> Text:
        return "action_query_product_attribute"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[SlotSet]:
        slot_events: List[SlotSet] = []

        # 1) Pull the current page out of metadata
        meta = tracker.latest_message.get("metadata", {}) or {}
        page = meta.get("page", "")

        # 2) If it's a product URL, fetch fresh doc from Mongo
        m = re.match(r"^/product/(?P<cat>[^/]+)/(?P<id>[0-9a-f]{24})$", page)
        if m:
            raw_cat, pid = m.group("cat"), m.group("id")
            if raw_cat in ["polishers", "pads", "compounds"]:
                coll = raw_cat
            elif raw_cat + "s" in ["polishers", "pads", "compounds"]:
                coll = raw_cat + "s"
            else:
                coll = None

            if coll:
                db_doc = db[coll].find_one({"_id": ObjectId(pid)}) or {}
                doc = bson_to_json(db_doc)
                slot_events += [
                    SlotSet("product_category", coll),
                    SlotSet("product_id", pid),
                    SlotSet("product_doc", doc),
                ]
            else:
                doc = {}
        else:
            # 3) Fallback to whatever's in the slot (if any)
            doc = tracker.get_slot("product_doc") or {}

        # 4) Map intent → field + unit
        intent = tracker.get_intent_of_latest_message()
        attr_map = {
            "ask_description": ("description", ""),
            "ask_weight":      ("weight", " kg"),
            "ask_power":       ("power", " W"),
            "ask_orbit":       ("orbit", " mm"),
            "ask_backingpad":  ("backingpad", ""),
            "ask_size":        ("size", ""),
            "ask_code":        ("code", ""),
            "ask_colour":      ("colour", ""),
        }

        if intent not in attr_map:
            dispatcher.utter_message("Sorry, I’m not sure what you want to know.")
            return slot_events

        field, unit = attr_map[intent]
        value = doc.get(field)
        name  = doc.get("name", "This product")

        if value is None:
            dispatcher.utter_message("I don’t have that detail right now.")
        else:
            dispatcher.utter_message(f"**{name}** {field} is {value}{unit}.")

        return slot_events
    
class ActionSessionStart(Action):
    def name(self) -> Text:
        return "action_session_start"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List:
        """Store the page URL (if any) in the `page` slot when the web-chat opens."""
        events = [SessionStarted()]

        meta     = tracker.latest_message.get("metadata", {}) or {}
        page_url = meta.get("page")
        if page_url:
            events.append(SlotSet("page", page_url))
            # immediately pull in the product from that page URL
            events.append(ActionExecuted("action_set_product_context"))

        # hand control back to the rule
        events.append(ActionExecuted("action_listen"))
        return events