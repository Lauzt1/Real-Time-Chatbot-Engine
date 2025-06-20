# show_products.py

import os
import json
import certifi
import datetime
from pymongo import MongoClient
from bson import ObjectId, DBRef, Decimal128
from dotenv import load_dotenv

# === CONFIG ===
DB_NAME = "FYP"   # your target database

# Load MONGODB_URI from .env
load_dotenv()
uri = os.getenv("MONGODB_URI")
if not uri:
    raise RuntimeError("MONGODB_URI not set in .env")

# === CONNECT ===
client = MongoClient(
    uri,
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=True,
    serverSelectionTimeoutMS=5000
)
db = client[DB_NAME]

# === BSON → JSON helper ===
def bson_to_json(obj):
    """
    Recursively convert BSON types to JSON-serializable types.
    """
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, DBRef):
        return {"$ref": obj.collection, "$id": str(obj.id)}
    if isinstance(obj, Decimal128):
        return float(obj.to_decimal())
    if isinstance(obj, datetime.datetime):
        # ISO 8601 string
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: bson_to_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [bson_to_json(v) for v in obj]
    return obj

# === MAIN ===
def main():
    # list all non-system collections
    collections = [c for c in db.list_collection_names() if not c.startswith("system.")]
    if not collections:
        print(f"No collections found in database '{DB_NAME}'.")
        return

    for coll_name in collections:
        coll = db[coll_name]
        count = coll.estimated_document_count()
        print(f"\n=== Collection: {coll_name} (count: {count}) ===\n")
        for doc in coll.find({}):
            doc_json = bson_to_json(doc)
            print(json.dumps(doc_json, indent=2, ensure_ascii=False))
            print("-" * 60)

if __name__ == "__main__":
    main()
