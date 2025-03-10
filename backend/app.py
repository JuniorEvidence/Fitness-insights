from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# ✅ CORS Configuration: Allow frontend to access API
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# ✅ MongoDB Configuration
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["MONGO_URI"] = "mongodb://localhost:27017/fitness_insights"
mongo = PyMongo(app)

# ✅ Register Routes Blueprint
from app.routes import routes
app.register_blueprint(routes)

if __name__ == "__main__":
    print("✅ Running Flask app...")
    app.run(debug=True)






