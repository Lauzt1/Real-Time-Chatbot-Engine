# show_products.py
import os
import json
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

# Load MONGO_URI from .env in the same directory
load_dotenv()

uri = os.getenv("MONGODB_URI")
if not uri:
    raise RuntimeError("MONGODB_URI not set in .env")

# Connect to Atlas
client = MongoClient(uri, tls=True, tlsCAFile=certifi.where())
db = client["test"]

# Fetch all products
products = list(db.products.find({}))

# Print each product as JSON
for prod in products:
    # Convert ObjectId and other BSON types to JSON-friendly
    print(json.dumps(prod, default=str, indent=2))
    print("-" * 50)
