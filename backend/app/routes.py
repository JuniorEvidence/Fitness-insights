from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import jwt
from werkzeug.utils import secure_filename
import bcrypt
from datetime import datetime, timedelta
import os
import re
from flask import current_app
from app import mongo 

import mimetypes
from gridfs import GridFS
from pymongo import MongoClient
import whisper
from pydub import AudioSegment
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("LLM_API_KEY")
openai_client = OpenAI(api_key=api_key)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_default_secret_key")

fs = GridFS(mongo.db)
audio_fs = GridFS(mongo.db, collection="audio_files")
routes = Blueprint("routes", __name__)

# ✅ Home Route
@routes.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask server is running!"}), 200

# ✅ Favicon Fix
@routes.route("/favicon.ico", methods=["GET"])
def favicon():
    return "", 204

# ✅ User Registration
@routes.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        if mongo.db.users.find_one({"email": email}):
            return jsonify({"message": "User already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        mongo.db.users.insert_one({"email": email, "password": hashed_password, "timestamp": datetime.utcnow()})

        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500

# ✅ User Login with JWT
@routes.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Email and password are required!"}), 400

        user = mongo.db.users.find_one({"email": email})
        if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({"message": "Invalid credentials!"}), 401

        token = create_access_token(identity=email, expires_delta=timedelta(hours=1))
        return jsonify({"token": token, "message": "Login successful!"}), 200

    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500

# ✅ Get Users (Protected)
@routes.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        users = mongo.db.users.find({}, {"_id": 1, "email": 1})
        users_list = [{"_id": str(user["_id"]), "email": user["email"]} for user in users]
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500

# ✅ Submit Text (Protected)
@routes.route("/submit-data", methods=["POST", "OPTIONS"])
@cross_origin(origin="http://localhost:3000", supports_credentials=True)
@jwt_required()
def submit_data():
    """Stores user health data in MongoDB."""
    if request.method == "OPTIONS":  # ✅ Handle CORS Preflight Request
        return jsonify({"message": "CORS Preflight OK"}), 200

    try:
        user_email = get_jwt_identity()  # Get the logged-in user's email
        data = request.get_json()

        print(f"🔹 Received Data from Frontend: {data}")  # ✅ Debugging log

        required_fields = ["foodInput", "calorieIntake", "caloriesBurnt", "waterIntake", "weight", "weightChange"]
        if not all(field in data for field in required_fields):
            print(f"❌ Missing fields: {set(required_fields) - set(data.keys())}")  # ✅ Debugging log
            return jsonify({"message": "Missing required fields"}), 400

        insert_result = mongo.db.user_health.insert_one({
            "user_email": user_email,
            "foodInput": data["foodInput"],
            "calorieIntake": data["calorieIntake"],
            "caloriesBurnt": data["caloriesBurnt"],
            "waterIntake": data["waterIntake"],
            "weight": data["weight"],
            "weightChange": data["weightChange"],
            "stepsWalked": data["stepsWalked"], 
            "sleepHours": data["sleepHours"], 
            "timestamp": datetime.utcnow(),
        })

        print(f"✅ Inserted Data ID: {insert_result.inserted_id}")  # ✅ Debugging log

        return jsonify({"message": "Data submitted successfully!"}), 201

    except Exception as e:
        print(f"❌ Error submitting data: {str(e)}")  # ✅ Debugging log
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500


# ✅ TEMP folder for audio processing
TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

# ✅ Load Whisper Model
whisper_model = whisper.load_model("base")

# ✅ Submit Audio (Protected)
@routes.route("/submit-audio", methods=["POST"])
@jwt_required()
def submit_audio():
    try:
        if "audio" not in request.files:
            return jsonify({"message": "No audio file provided"}), 400

        audio_file = request.files["audio"]
        user_email = get_jwt_identity()

        file_ext = audio_file.filename.rsplit(".", 1)[-1].lower()
        temp_audio_path = os.path.join(TEMP_DIR, f"input_audio.{file_ext}")
        converted_audio_path = os.path.join(TEMP_DIR, "converted_audio.wav")

        audio_file.save(temp_audio_path)

        # Convert to WAV if needed
        if file_ext not in ["wav", "flac", "mp3"]:
            audio = AudioSegment.from_file(temp_audio_path)
            audio.export(converted_audio_path, format="wav")
            temp_audio_path = converted_audio_path

        # Transcribe audio
        result = whisper_model.transcribe(temp_audio_path)
        transcription_text = result.get("text", "").strip()

        # Store audio in GridFS
        with open(temp_audio_path, "rb") as audio_data:
            audio_id = audio_fs.put(audio_data, filename=audio_file.filename, content_type=audio_file.content_type)

        mongo.db.audio_transcriptions.insert_one({
            "user_email": user_email,
            "audio_id": audio_id,
            "filename": audio_file.filename,
            "transcription": transcription_text
        })

        os.remove(temp_audio_path)
        if os.path.exists(converted_audio_path):
            os.remove(converted_audio_path)

        return jsonify({
            "message": "Transcription successful!",
            "text": transcription_text,
            "audio_id": str(audio_id)
        }), 201

    except Exception as e:
        return jsonify({"message": "Could not transcribe audio", "error": str(e)}), 400

# ✅ Upload Media (Protected)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "mp4", "mov", "avi"}
MAX_FILE_SIZE_MB = 50 * 1024 * 1024  # 50MB

@routes.route("/upload-media", methods=["POST"])
@jwt_required()
def upload_media():
    try:
        user_email = get_jwt_identity()
        if "file" not in request.files:
            return jsonify({"message": "No file uploaded"}), 400

        file = request.files["file"]
        filename = secure_filename(file.filename)
        file_mime_type = file.content_type
        upload_date = datetime.utcnow()

        if file.content_length > MAX_FILE_SIZE_MB:
            return jsonify({"message": "File too large!"}), 400

        file_id = fs.put(file, filename=filename, content_type=file_mime_type, user_email=user_email, upload_date=upload_date)

        return jsonify({
            "message": "File uploaded successfully!",
            "file_id": str(file_id),
            "filename": filename,
            "file_type": file_mime_type,
            "upload_date": upload_date.isoformat(),
        }), 201

    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500

# ✅ LLM Integration: Generate Insights from User Logs
@routes.route("/generate-insights", methods=["POST"])
@jwt_required()
def generate_insights():
    """Generates user insights from MongoDB logs."""
    
    try:
        user_email = get_jwt_identity()
        print(f"🔍 Fetching logs for: {user_email}")  # ✅ Debugging

        user_logs = mongo.db.user_health.find({"user_email": user_email})

        insights = []
        for log in user_logs:
            # ✅ Check if timestamp exists and format it
            timestamp = log.get("timestamp")
            if timestamp:
                formatted_date = timestamp.strftime("%d %b")  # e.g., "08 Mar"
                formatted_month = timestamp.strftime("%b %Y")  # e.g., "Mar 2025"
            else:
                formatted_date = "Unknown"
                formatted_month = "Unknown"

            print(f"🗓️ Log Entry: {log}")  # ✅ Debugging: Print log data

            insights.append({
                "date": formatted_date,
                "month": formatted_month,
                "steps_walked": log.get("stepsWalked", 0),
                "calories_burnt": log.get("caloriesBurnt", 0),
                "sleep_hours": log.get("sleepHours", 0),
                "weight_difference": log.get("weightChange", 0),
            })

        return jsonify({"insights": insights}), 200

    except Exception as e:
        print(f"🚨 Error generating insights: {str(e)}")  # ✅ Log error
        return jsonify({"message": "Error generating insights", "error": str(e)}), 500 