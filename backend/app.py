from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017")
db = client["fitnessinsightdb"]

@app.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

if __name__ == "__main__":
    app.run(debug=True)

