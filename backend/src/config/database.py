import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")

client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client.finsight

users_collection = db.users
chats_collection = db.chats
documents_collection = db.documents