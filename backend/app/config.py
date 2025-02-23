from dotenv import load_dotenv
import os

load_dotenv()  # Load .env variables

class Config:
    MONGO_URI = "mongodb://localhost:27017/fitnessinsightdb"

    SECRET_KEY = os.environ.get("3cfb2863410cfca03d2f5d629d8fc52cf9d6ee3a77f1327c3eb2dc9f93fd5485")