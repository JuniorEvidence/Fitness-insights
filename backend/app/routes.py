from app import app

@app.route('/')
def home():
    return {"message": "Welcome to Fitness Insights Backend!"}

