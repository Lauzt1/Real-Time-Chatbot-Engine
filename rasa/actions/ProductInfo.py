import os
import csv
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionCompareProducts(Action):
    def name(self) -> str:
        return "action_compare_products"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        # Path to the CSV file (assumed to be in the data folder)
        products_file_path = os.path.join("data", "products.csv")
        products = {}

        try:
            with open(products_file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    product_name = row.get("product_name")
                    if product_name:
                        products[product_name] = row
        except Exception as e:
            dispatcher.utter_message(text=f"Error loading product data: {e}")
            return []

        # Retrieve the two products we want to compare
        product1 = products.get("LHR15 MarkIII/STD")
        product2 = products.get("LHR21 MarkIII/STD")

        if not product1 or not product2:
            dispatcher.utter_message(text="Sorry, product data is missing.")
            return []

        # Build a comparison message.
        message = "Comparison between LHR15 and LHR21:\n\n"
        message += "LHR15 MarkIII/STD:\n"
        message += f"  Backing Pad: {product1.get('backing_pad')}\n"
        message += f"  Orbit: {product1.get('orbit')}\n"
        message += f"  Power: {product1.get('power')}\n"
        message += f"  R.P.M.: {product1.get('rpm')}\n"
        message += f"  Weight: {product1.get('weight')}\n"
        message += f"  Electronic Speed Control: {product1.get('electronic_speed_control')}\n"
        message += f"  Spindle Thread: {product1.get('spindle_thread')}\n"
        message += f"  Electrical Cord: {product1.get('electrical_cord')}\n\n"

        message += "LHR21 MarkIII/STD:\n"
        message += f"  Backing Pad: {product2.get('backing_pad')}\n"
        message += f"  Orbit: {product2.get('orbit')}\n"
        message += f"  Power: {product2.get('power')}\n"
        message += f"  R.P.M.: {product2.get('rpm')}\n"
        message += f"  Weight: {product2.get('weight')}\n"
        message += f"  Electronic Speed Control: {product2.get('electronic_speed_control')}\n"
        message += f"  Spindle Thread: {product2.get('spindle_thread')}\n"
        message += f"  Electrical Cord: {product2.get('electrical_cord')}\n"

        dispatcher.utter_message(text=message)
        return []

class ActionProductInfo(Action):
    def name(self) -> str:
        return "action_product_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        # Path to the CSV file (assumed to be in the data folder)
        products_file_path = os.path.join("data", "products.csv")
        products = {}

        try:
            with open(products_file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    product_name = row.get("product_name")
                    if product_name:
                        products[product_name] = row
        except Exception as e:
            dispatcher.utter_message(text=f"Error loading product data: {e}")
            return []

        # In this example, we assume that a query like "tell me about LHR15"
        # should return details for "LHR15 MarkIII/STD".
        product = products.get("LHR15 MarkIII/STD")
        if not product:
            dispatcher.utter_message(text="Sorry, product information is not available.")
            return []

        # Build a product information message.
        message = "Information for LHR15 MarkIII/STD:\n\n"
        message += f"Backing Pad: {product.get('backing_pad')}\n"
        message += f"Orbit: {product.get('orbit')}\n"
        message += f"Power: {product.get('power')}\n"
        message += f"R.P.M.: {product.get('rpm')}\n"
        message += f"Weight: {product.get('weight')}\n"
        message += f"Electronic Speed Control: {product.get('electronic_speed_control')}\n"
        message += f"Spindle Thread: {product.get('spindle_thread')}\n"
        message += f"Electrical Cord: {product.get('electrical_cord')}\n"

        dispatcher.utter_message(text=message)
        return []