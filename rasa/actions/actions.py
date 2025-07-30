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
    def name(self) -> str:
        return "action_product_info"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: dict
    ) -> list:
        """
        Looks up a product by name or code, utters its description,
        and provides a direct link to the product page.
        """
        user_msg = tracker.latest_message.get("text", "").lower()
        base_url = "http://localhost:3000/product"

        # Pre-cleaned user text for matching
        clean_user = re.sub(r"[^a-z0-9 ]+", "", user_msg)

        for coll in ["polishers", "pads", "compounds"]:
            for doc in db[coll].find():
                name_lower = doc.get("name", "").lower()
                code_lower = doc.get("code", "").lower()

                # Clean the stored name the same way
                clean_name = re.sub(r"[^a-z0-9 ]+", "", name_lower)

                if (clean_name and clean_name in clean_user) or \
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
    
class ActionGlobalProductSpecs(Action):
    def name(self) -> str:
        return "action_global_product_specs"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: dict
    ) -> list:
        """Lookup a product by name or code anywhere, then utter its key specs + link."""
        user_msg = tracker.latest_message.get("text", "").lower()
        base_url = "http://localhost:3000/product"
        clean_user = re.sub(r"[^a-z0-9 ]+", "", user_msg)

        for coll in ["polishers", "pads", "compounds"]:
            for doc in db[coll].find():
                name_lower = doc.get("name", "").lower()
                code_lower = doc.get("code", "").lower()
                clean_name = re.sub(r"[^a-z0-9 ]+", "", name_lower)

                if (clean_name and clean_name in clean_user) or \
                   (code_lower and re.search(rf"\b{re.escape(code_lower)}\b", user_msg)):

                    serial = bson_to_json(doc)
                    pid = str(doc.get("_id"))
                    route = coll[:-1]
                    link = f"{base_url}/{route}/{pid}"

                    # build specs
                    specs = []
                    if "power" in serial:
                        specs.append(f"Power: {serial['power']} W")
                    if "rpm" in serial:
                        specs.append(f"RPM: {serial['rpm']}")
                    if "weight" in serial:
                        specs.append(f"Weight: {serial['weight']} kg")
                    if "orbit" in serial:
                        specs.append(f"Orbit: {serial['orbit']} mm")
                    # backingpad for polishers, size for pads/compounds
                    if "backingpad" in serial:
                        specs.append(f"Backing pad: {serial['backingpad']} inch")
                    elif "size" in serial:
                        unit = "ml" if route == "compound" else "inch"
                        specs.append(f"Size: {serial['size']} {unit}")

                    dispatcher.utter_message(text=f"**{serial['name']}** specs:\n" + "\n".join(f"- {s}" for s in specs))
                    dispatcher.utter_message(text=f"View full details here: {link}")

                    return [
                        SlotSet("product_doc", serial),
                        SlotSet("product_id", pid),
                        SlotSet("product_category", coll),
                        SlotSet("product_model", name_lower),
                    ]

        dispatcher.utter_message(text="Sorry, I couldn’t find that product.")
        return []


class ActionProductLink(Action):
    def name(self) -> str:
        return "action_product_link"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: dict
    ) -> list:
        user_msg = tracker.latest_message.get("text", "").lower()
        base_url = "http://localhost:3000/product"

        # Pre-cleaned user text for matching
        clean_user = re.sub(r"[^a-z0-9 ]+", "", user_msg)

        for coll in ["polishers", "pads", "compounds"]:
            for doc in db[coll].find():
                name = doc.get("name", "").lower()
                code = doc.get("code", "").lower()

                # Clean the stored name the same way
                clean_name = re.sub(r"[^a-z0-9 ]+", "", name)

                if (clean_name and clean_name in clean_user) or \
                   (code and re.search(rf"\b{re.escape(code)}\b", user_msg)):
                    product_id = str(doc.get("_id"))
                    # singular route
                    route = coll[:-1]
                    link = f"{base_url}/{route}/{product_id}"

                    dispatcher.utter_message(text=f"You can view it here: {link}")
                    return [
                        SlotSet("product_doc", bson_to_json(doc)),
                        SlotSet("product_id", product_id),
                        SlotSet("product_category", coll),
                        SlotSet("product_model", name),
                    ]

        dispatcher.utter_message(text="Sorry, I couldn’t find the product link.")
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
            "ask_type":        ("type", ""),
            "ask_properties":  ("properties", ""),
        }

        # Adding specific conditions based on the category of the product
        if intent == "ask_rpm" and doc.get("type") == "Dual-Action" and doc.get("rpm"):
            field, unit = "rpm", ""
            value = doc.get(field)
            name  = doc.get("name", "This product")
            if value is None:
                dispatcher.utter_message("I don’t have that detail right now.")
            else:
                dispatcher.utter_message(f"**{name}** RPM is {value}.")
            return slot_events

        if intent == "ask_type" and doc.get("type"):
            field, unit = "type", ""
            value = doc.get(field)
            name  = doc.get("name", "This product")
            if value is None:
                dispatcher.utter_message("I don’t have that detail right now.")
            else:
                dispatcher.utter_message(f"**{name}** type is {value}.")
            return slot_events

        if intent == "ask_properties" and doc.get("properties"):
            field, unit = "properties", ""
            value = doc.get(field)
            name  = doc.get("name", "This product")
            if value is None:
                dispatcher.utter_message("I don’t have that detail right now.")
            else:
                dispatcher.utter_message(f"**{name}** properties are {value}.")
            return slot_events

        # Standard cases, using attribute mapping
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

    
class ActionContextualProductSpecs(Action):
    def name(self) -> str:
        return "action_contextual_product_specs"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: dict
    ) -> list:
        # 1) Try to grab existing slot
        doc = tracker.get_slot("product_doc") or {}

        # 2) If no slot, fall back to metadata lookup (just like in action_query_product_attribute)
        if not doc:
            meta = tracker.latest_message.get("metadata", {}) or {}
            page = meta.get("page", "")
            m = re.match(r"^/product/(?P<cat>[^/]+)/(?P<id>[0-9a-f]{24})$", page)
            if m:
                raw_cat, pid = m.group("cat"), m.group("id")
                # normalize to your Mongo collections
                if raw_cat in ["polishers", "pads", "compounds"]:
                    coll = raw_cat
                elif raw_cat + "s" in ["polishers", "pads", "compounds"]:
                    coll = raw_cat + "s"
                else:
                    coll = None

                if coll:
                    db_doc = db[coll].find_one({"_id": ObjectId(pid)}) or {}
                    doc = bson_to_json(db_doc)

        # 3) If still no doc, bail out
        if not doc:
            dispatcher.utter_message(text="I don’t see which product you mean—can you tap on its page first?")
            return []

        # 4) Build and utter specs
        specs = []
        if doc.get("power") is not None:
            specs.append(f"Power: {doc['power']} W")
        if doc.get("rpm") is not None:
            specs.append(f"RPM: {doc['rpm']}")
        if doc.get("weight") is not None:
            specs.append(f"Weight: {doc['weight']} kg")
        if doc.get("orbit") is not None:
            specs.append(f"Orbit: {doc['orbit']} mm")
        if doc.get("backingpad") is not None:
            specs.append(f"Backing pad: {doc['backingpad']} inch")
        elif doc.get("size") is not None:
            # determine unit by category slot
            route = tracker.get_slot("product_category") or ""
            unit = "ml" if route.rstrip("s") == "compound" else "inch"
            specs.append(f"Size: {doc['size']} {unit}")

        dispatcher.utter_message(
            text=f"**{doc.get('name','This product')}** specs:\n" +
                 "\n".join(f"- {s}" for s in specs)
        )
        return []
    
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
    
class ActionMarkFallback(Action):
    def name(self) -> str:
        return "action_mark_fallback"

    async def run(self, dispatcher, tracker, domain):
        # 1st-stage fallback message + mark that we’re waiting for yes/no
        dispatcher.utter_message(template="utter_fallback")
        return [SlotSet("just_failed", True)]
    
class ActionAskQuote(Action):
    def name(self) -> Text:
        return "action_ask_quote"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        """
        If the user is on /product/<category>/<id>, append #enquiry
        and send them the link. Otherwise prompt them to move to a
        product page first.
        """
        # 1) Try metadata first (your frontend should send { metadata: { page } })
        metadata = tracker.latest_message.get("metadata", {}) or {}
        page_url = metadata.get("page")

        # 2) Fallback to slot if metadata isn't present
        if not page_url:
            page_url = tracker.get_slot("page")

        # 3) Check for a product URL
        if page_url and "/product/" in page_url:
            # strip any existing hash, then add #enquiry
            base = page_url.split("#", 1)[0]
            enquiry_link = f"{base}#enquiry"

            dispatcher.utter_message(
                text=f"Sure! Here’s the enquiry link for this product: {enquiry_link}"
            )
        else:
            dispatcher.utter_message(
                text="Please ask for a quote while on a product page, and I’ll give you the enquiry link!"
            )

        return []
    
class ActionFindProducts(Action):
    def name(self) -> str:
        return "action_find_products"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: dict
    ) -> list:
        user_msg = tracker.latest_message.get("text", "").lower()
        base_url = "http://localhost:3000/product"
        results = []

        # Categories to search in: polishers, pads, compounds
        categories = {
            "polishers": db["polishers"],
            "pads": db["pads"],
            "compounds": db["compounds"]
        }

        # Clean up user message for matching keywords
        clean_user = re.sub(r"[^a-z0-9 ]+", "", user_msg)

        # Check for polishers, pads, and compounds in the query
        category = None
        if "polisher" in clean_user or "polishers" in clean_user:
            category = "polishers"
        elif "pad" in clean_user or "pads" in clean_user:
            category = "pads"
        elif "compound" in clean_user or "compounds" in clean_user:
            category = "compounds"
        
        # If no specific category is found
        if not category:
            dispatcher.utter_message(text="Sorry, I couldn't understand which product you're asking for.")
            return []

        # Search for products in the selected category
        if category == "polishers":
            for doc in categories[category].find():
                name = doc.get("name", "").lower()
                type_ = doc.get("type", "").lower()
                # Checking for matches in type and general name
                if any(keyword in name for keyword in clean_user.split()) or any(keyword in type_ for keyword in clean_user.split()):
                    product_id = str(doc.get("_id"))
                    route = category[:-1]  # Singular route for the product
                    link = f"{base_url}/{route}/{product_id}"
                    results.append(f"{name.upper()}: {link}")
        
        elif category == "pads":
            for doc in categories[category].find():
                name = doc.get("name", "").lower()
                properties = doc.get("properties", "").lower()
                colour = doc.get("colour", "").lower()
                # Check for matches in name, properties, or colour
                if any(keyword in name for keyword in clean_user.split()) or \
                   any(keyword in properties for keyword in clean_user.split()) or \
                   any(keyword in colour for keyword in clean_user.split()):
                    product_id = str(doc.get("_id"))
                    route = category[:-1]  # Singular route for the product
                    link = f"{base_url}/{route}/{product_id}"
                    results.append(f"{name.upper()}: {link}")
        
        elif category == "compounds":
            for doc in categories[category].find():
                name = doc.get("name", "").lower()
                type_ = doc.get("type", "").lower()
                # Checking for matches in name and type
                if any(keyword in name for keyword in clean_user.split()) or any(keyword in type_ for keyword in clean_user.split()):
                    product_id = str(doc.get("_id"))
                    route = category[:-1]  # Singular route for the product
                    link = f"{base_url}/{route}/{product_id}"
                    results.append(f"{name.upper()}: {link}")

        # If products were found, show the links, each on a new line
        if results:
            # Join the results with "\n" to ensure each product appears on a new line
            formatted_results = "\n".join(results)
            dispatcher.utter_message(text=formatted_results)  
        else:
            dispatcher.utter_message(text="Sorry, I couldn't find any matching products.")

        return []

class ActionAgentHandoff(Action):
    def name(self) -> str:
        return "action_agent_handoff"

    async def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(template="utter_agent_fallback")
        return [SlotSet("just_failed", False)]

class ActionClearFailure(Action):
    def name(self) -> str:
        return "action_clear_failure"

    async def run(self, dispatcher, tracker, domain):
        # no message—just clear the slot
        return [SlotSet("just_failed", False)]
