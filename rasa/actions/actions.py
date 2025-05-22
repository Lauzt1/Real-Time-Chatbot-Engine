import os
import re
import json
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

# Load environment and connect
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

uri = os.getenv("MONGODB_URI")
client = MongoClient(uri, tls=True, tlsCAFile=certifi.where())
db = client["test"]

class ActionFetchProductInfo(Action):
    def name(self) -> Text:
        return "action_fetch_product_info"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Fetch all product names and build lookup maps
        product_names = db.products.distinct("name")
        if not product_names:
            dispatcher.utter_message(text="No products found in the database.")
            return []

        # Map lowercase name to stored name
        name_map = {name.lower(): name for name in product_names}
        # Build regex from stored names
        escaped = sorted((re.escape(name) for name in product_names), key=len, reverse=True)
        model_regex = re.compile(r"\b(?:" + "|".join(escaped) + r")\b", re.IGNORECASE)

        text = tracker.latest_message.get("text", "")
        match = model_regex.search(text)
        if not match:
            dispatcher.utter_message(text="Which model? Try e.g. ‘specs for LHR15 MarkV’.")
            return []

        raw_match = match.group(0).strip()
        # Normalize to stored name via lowercase lookup
        model_key = raw_match.lower()
        model = name_map.get(model_key)
        if not model:
            dispatcher.utter_message(text=f"Sorry, couldn’t normalize model **{raw_match}**.")
            return []

        # Fetch the corresponding document
        doc = db.products.find_one({"name": model})
        if not doc:
            dispatcher.utter_message(text=f"Sorry, no data found for **{model}**.")
            return []

        # Prepare specs
        specs = []
        if 'backingpadinch' in doc:
            specs.append(f"- Backing pad: {doc['backingpadinch']} inch")
        if 'orbitmm' in doc:
            specs.append(f"- Orbit: {doc['orbitmm']} mm")
        if 'powerw' in doc:
            specs.append(f"- Power: {doc['powerw']} W")
        if 'rpm' in doc:
            specs.append(f"- R.P.M.: {doc['rpm']}")
        if 'weightkg' in doc:
            specs.append(f"- Weight: {doc['weightkg']} kg")

        msg = f"**{doc['name']}**\n" + "\n".join(specs)
        dispatcher.utter_message(text=msg)
        return []
