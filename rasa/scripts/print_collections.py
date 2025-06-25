import os
import json
import certifi
import datetime
from pymongo import MongoClient
from bson import ObjectId, DBRef, Decimal128
from dotenv import load_dotenv
from pathlib import Path

# === CONFIG ===
# Load environment variables from the .env file in the project root (rasa/.env)
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

DB_NAME = os.getenv("DB_NAME", None)

# === HELPERS ===
def bson_to_serializable(obj):
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
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: bson_to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [bson_to_serializable(v) for v in obj]
    return obj

# === MAIN ===
def main():
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise RuntimeError("MONGODB_URI not set in .env")

    # Connect to MongoDB
    client = MongoClient(
        uri,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000
    )

    # Determine which database to use
    if DB_NAME:
        db = client[DB_NAME]
    else:
        # Fallback to database specified in URI
        db = client.get_default_database()

    print(f"Connected to database: '{db.name}'")

    # List and iterate over collections
    collections = [c for c in db.list_collection_names() if not c.startswith("system.")]

    if not collections:
        print(f"No non-system collections found in '{db.name}'.")
        return

    for coll_name in collections:
        coll = db[coll_name]
        docs = list(coll.find())
        print(f"\n=== Collection: {coll_name} (count: {len(docs)}) ===")
        for doc in docs:
            serial = bson_to_serializable(doc)
            print(json.dumps(serial, indent=2, ensure_ascii=False))
        print("-" * 60)

if __name__ == "__main__":
    main()
