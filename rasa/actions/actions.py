import os
import re
import json
import certifi
import datetime
from pymongo import MongoClient
from bson import ObjectId, DBRef, Decimal128
from dotenv import load_dotenv
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

# Load .env from project root
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

# --- CONNECT TO MONGODB ---
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise RuntimeError("MONGODB_URI not set in .env")

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=True,
    serverSelectionTimeoutMS=5000
)
db = client["shinehub"]

# --- HANDLE BSON → JSON (for any future dumps) ---
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

# --- NO-OP ACTION (unchanged) ---
class ActionNoop(Action):
    def name(self):
        return "action_noop"

    def run(self, dispatcher, tracker, domain):
        return []

# --- PRODUCT INFO (now supporting 3 collections) ---
class ActionProductInfo(Action):
    def name(self) -> str:
        return "action_product_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List:

        user_msg = tracker.latest_message.get("text", "").lower()

        # 1) load from all collections
        polisher_docs = list(db.polishers.find({}))
        pad_docs      = list(db.pads.find({}))
        comp_docs     = list(db.compounds.find({}))

        # 2) build unified catalog [(name, doc, category), ...]
        catalog = []
        for d in polisher_docs:
            catalog.append((d["name"].lower(), d, "polisher"))
        for d in pad_docs:
            catalog.append((d["name"].lower(), d, "pad"))
        for d in comp_docs:
            catalog.append((d["name"].lower(), d, "compound"))

        # 3) find first match by name word‐boundary
        match = None
        for name, doc, cat in catalog:
            if re.search(rf"\b{re.escape(name)}\b", user_msg):
                match = (doc, cat)
                break

        if not match:
            dispatcher.utter_message(
                text="Sorry, I couldn’t find that item. Please specify the exact model or product name."
            )
            return []

        doc, category = match

        # 4) format according to category
        if category == "polisher":
            specs = (
                f"**{doc['name']}** (Polisher) specs:\n"
                f"- Backing pad: {doc['backingpad']} in  \n"
                f"- Orbit diameter: {doc['orbit']} mm  \n"
                f"- Power: {doc['power']} W  \n"
                f"- RPM: {doc.get('rpm', 'n/a')}  \n"
                f"- Weight: {doc['weight']} kg  \n"
                f"- Description: {doc.get('description', '')}\n"
            )

        elif category == "pad":
            specs = (
                f"**{doc['name']}** (Pad) specs:\n"
                f"- Code: {doc['code']}  \n"
                f"- Size: {doc['size']} mm  \n"
                f"- Colour: {doc.get('colour', 'n/a')}  \n"
                f"- Description: {doc.get('description', '')}\n"
            )

        else:  # compound
            specs = (
                f"**{doc['name']}** (Compound) specs:\n"
                f"- Code: {doc['code']}  \n"
                f"- Size: {doc['size']} g  \n"
                f"- Description: {doc.get('description', '')}\n"
            )

        # optional product page link
        safe_name = doc['name'].replace(" ", "%20")
        link = f"https://example.com/products/{safe_name}"
        dispatcher.utter_message(text=specs + f"\n🔗 [View product page]({link})")

        # set slot so you remember which model was asked
        return [SlotSet("product_model", doc["name"])]
