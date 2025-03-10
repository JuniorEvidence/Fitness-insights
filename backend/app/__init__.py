from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}},
     allow_headers=["Authorization", "Content-Type", "X-Requested-With"])

# MongoDB Configuration
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["MONGO_URI"] = "mongodb://localhost:27017/fitness_insights"
mongo = PyMongo(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_default_secret_key")  # Store in .env
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]  # Ensure JWT tokens are passed in headers
app.config["JWT_HEADER_NAME"] = "Authorization"  # ✅ Ensure Authorization header is used
app.config["JWT_HEADER_TYPE"] = "Bearer"  

# Initialize Extensions
mongo = PyMongo(app)
jwt = JWTManager(app) 

# Import and register the routes after `app` is created
from app.routes import routes
app.register_blueprint(routes)

