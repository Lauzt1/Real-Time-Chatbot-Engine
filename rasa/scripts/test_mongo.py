import os, certifi
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGODB_URI")

# === Workaround: allow invalid certs ===
client = MongoClient(
    uri,
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=True,           # ← add this
    serverSelectionTimeoutMS=5000               # ← faster failure, if it still can’t connect
)

db = client["test"]
print("Products in DB:", db.products.count_documents({}))
print("Example:", db.products.find_one({}, {"name": 1}))
