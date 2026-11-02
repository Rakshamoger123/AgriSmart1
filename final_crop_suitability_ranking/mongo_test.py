
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DB_NAME", "agrismart")

if not uri:
    raise RuntimeError("MONGODB_URI is missing. Check your .env file.")

client = MongoClient(uri, serverSelectionTimeoutMS=10000)

try:
    client.admin.command("ping")
    print("SUCCESS: Connected to MongoDB Atlas!")

    db = client[db_name]
    print("Database selected:", db.name)
    print("Collections:", db.list_collection_names())

except Exception as error:
    print("Connection failed:", type(error).__name__)
    print(str(error))

finally:
    client.close()
