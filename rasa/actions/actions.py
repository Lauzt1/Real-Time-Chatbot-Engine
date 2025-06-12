import os
import re
import json
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

# Load environment variables from the project root .env
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

# Connect to MongoDB Atlas
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise RuntimeError("MONGODB_URI not set in .env")

client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
db = client["test"]
products = db["products"]

class ActionNoop(Action):
    def name(self):
        return "action_noop"

    def run(self, dispatcher, tracker, domain):
        # do nothing
        return []

class ActionProductInfo(Action):
    def name(self) -> str:
        return "action_product_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:

        user_msg = tracker.latest_message.get("text", "").lower()

        # Load all product docs once
        docs = list(products.find({}))
        # Build list of (name_lower, doc) tuples
        catalog = [(doc["name"].lower(), doc) for doc in docs]

        # Find the first whose name appears in user_msg
        match = None
        for name, doc in catalog:
            # word-boundary match so "LHR15" won't hit "LHR1500"
            if re.search(rf"\b{re.escape(name)}\b", user_msg):
                match = doc
                break

        if not match:
            dispatcher.utter_message(text=(
                "Sorry, I couldn’t find that model. "
                "Please specify exactly (e.g. “LHR21 MarkV”)."
            ))
            return []

        # Format specs
        specs = (
            f"**{match['name']}** specs:\n"
            f"- Backing pad: {match['backingpadinch']} in  \n"
            f"- Orbit diameter: {match['orbitmm']} mm  \n"
            f"- Power: {match['powerw']} W  \n"
            f"- RPM: {match['rpm']}  \n"
            f"- Weight: {match['weightkg']} kg  \n"
        )
        # Placeholder link (update domain when real pages exist)
        link = f"https://example.com/products/{match['name'].replace(' ', '%20')}"
        dispatcher.utter_message(text=specs + f"\n🔗 [View product page]({link})")

        # Optionally set a slot for context awareness
        return [SlotSet("product_model", match["name"])]