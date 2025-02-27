from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import jwt
import datetime
import bcrypt
from functools import wraps
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Configurations
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")  # Store your secret key in a .env file
app.config["MONGO_URI"] = "mongodb://localhost:27017/fitness_insights"

# Initialize MongoDB
mongo = PyMongo(app)
users_collection = mongo.db.users  # Users collection
inputs_collection = mongo.db.inputs  # Inputs collection

# JWT Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token is missing!", "status": "error"}), 401
        
        try:
            token = token.split(" ")[1]  # Remove "Bearer " from token
            decoded_data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = users_collection.find_one({"email": decoded_data["email"]})
            if not current_user:
                return jsonify({"message": "User not found!", "status": "error"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired!", "status": "error"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!", "status": "error"}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask server is running!"})

# User Registration
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        # Debugging print statement to inspect received data
        print(f"🔹 Received Data: {data}")

        if not data or "email" not in data or "password" not in data:
            return jsonify({"message": "Email and password are required"}), 400

        # Default `username` to an empty string if not provided
        username = data.get("username", "")

        if users_collection.find_one({"email": data["email"]}):
            return jsonify({"message": "User already exists"}), 400

        hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        user_data = {
            "username": username,
            "email": data["email"],
            "password": hashed_password
        }

        users_collection.insert_one(user_data)

        print(f"✅ User Registered: {user_data}")  # Debugging log
        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        print(f"❌ Registration Error: {str(e)}")  # Debugging log
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500


# User Login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")  # Accept email instead of username
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required!", "status": "error"}), 400

    user = users_collection.find_one({"email": email})  # Search user by email
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"message": "Invalid credentials!", "status": "error"}), 401

    # Generate JWT token
    token = jwt.encode(
        {"email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        app.config["SECRET_KEY"],
        algorithm="HS256",
    )

    return jsonify({"token": token, "message": "Login successful!", "status": "success"}), 200

# Get Users (Protected)
@app.route("/users", methods=["GET"])
@token_required
def get_users(current_user):
    users = users_collection.find({}, {"_id": 1, "email": 1})  # Fetch email instead of username
    users_list = [{"_id": str(user["_id"]), "email": user["email"]} for user in users]  # Modify response
    return jsonify(users_list), 200

# Store User Input (Protected)
@app.route("/submit-input", methods=["POST"])
@token_required
def submit_input(current_user):
    data = request.get_json()
    input_data = {
        "user_email": current_user["email"],
        "input1": data["input1"],
        "input2": data["input2"],
        "timestamp": datetime.datetime.utcnow()
    }
    inputs_collection.insert_one(input_data)
    return jsonify({"message": "Input saved successfully!"}), 201

if __name__ == "__main__":
    app.run(debug=True)




