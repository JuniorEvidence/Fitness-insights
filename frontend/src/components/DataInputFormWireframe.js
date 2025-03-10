import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VoiceInput from "./VoiceInput";
import FileUpload from "./FileUpload";

// ✅ Predefined calorie list
const calorieDatabase = {
  "rice": 130,
  "chicken": 165,
  "salad": 50,
  "bread": 75,
  "banana": 105,
  "milk": 42,
  "egg": 68,
  "apple": 52,
  "cheese": 110,
  "potato": 77,
};

const DataInputFormWireframe = () => {
  const navigate = useNavigate();

  const [foodInput, setFoodInput] = useState("");
  const [calorieIntake, setCalorieIntake] = useState(0);
  const [caloriesBurnt, setCaloriesBurnt] = useState(0);
  const [waterIntake, setWaterIntake] = useState(2);
  const [weight, setWeight] = useState(70);
  const [stepsWalked, setStepsWalked] = useState(5000);
  const [sleepHours, setSleepHours] = useState(7); // ✅ New Sleep Hours Input
  const [message, setMessage] = useState("");

  // ✅ Calculate Calories from Food Input
  const calculateCalories = () => {
    let totalCalories = 0;
    const foodItems = foodInput.toLowerCase().split(",").map(item => item.trim());

    foodItems.forEach(item => {
      if (calorieDatabase[item]) {
        totalCalories += calorieDatabase[item];
      }
    });

    setCalorieIntake(totalCalories);
  };

  // ✅ Send Data to Backend
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ User not authenticated!");
      return;
    }

    const data = {
      foodInput,
      calorieIntake,
      caloriesBurnt,
      waterIntake,
      weight,
      stepsWalked,
      sleepHours, // ✅ Include Sleep Hours
      weightChange: weight - 70, // Assuming 70kg as baseline
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/submit-data",
        data,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setMessage("✅ Data Submitted Successfully!");
      console.log("📤 Submitted Data:", response.data);
    } catch (error) {
      console.error("❌ Submission Error:", error.response?.data);
      setMessage("❌ Failed to Submit Data!");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Data Input</h2>

      {/* 🍽️ Food Intake & Calorie Calculation */}
      <label className="block text-gray-700 font-semibold mb-2">Enter Food Items:</label>
      <input
        type="text"
        placeholder="e.g. Rice, Chicken, Salad"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        value={foodInput}
        onChange={(e) => setFoodInput(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={calculateCalories}
      >
        Calculate Calories
      </button>
      <p className="mt-2 text-gray-700">Total Calories Intake: <b>{calorieIntake} kcal</b></p>

      {/* 🔥 Calories Burnt Slider */}
      <label className="block text-gray-700 font-semibold mt-4">Calories Burnt:</label>
      <input
        type="range"
        min="0"
        max="1000"
        step="10"
        value={caloriesBurnt}
        onChange={(e) => setCaloriesBurnt(e.target.value)}
        className="w-full"
      />
      <p className="text-gray-700">🔥 {caloriesBurnt} kcal</p>

      {/* 💧 Water Intake Slider */}
      <label className="block text-gray-700 font-semibold mt-4">Water Intake (Liters):</label>
      <input
        type="range"
        min="1"
        max="5"
        step="0.5"
        value={waterIntake}
        onChange={(e) => setWaterIntake(e.target.value)}
        className="w-full"
      />
      <p className="text-gray-700">💧 {waterIntake} L</p>

      {/* ⚖️ Weight Input */}
      <label className="block text-gray-700 font-semibold mt-4">Weight (kg):</label>
      <input
        type="number"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <p className="text-gray-700">⚖️ Weight Change: {weight - 70} kg</p>

      {/* 🚶 Steps Walked Input */}
      <label className="block text-gray-700 font-semibold mt-4">Steps Walked:</label>
      <input
        type="range"
        min="1000"
        max="20000"
        step="500"
        value={stepsWalked}
        onChange={(e) => setStepsWalked(e.target.value)}
        className="w-full"
      />
      <p className="text-gray-700">🚶 {stepsWalked} steps</p>

      {/* 😴 Sleep Hours Input */}
      <label className="block text-gray-700 font-semibold mt-4">Sleep Hours:</label>
      <input
        type="range"
        min="1"
        max="12"
        step="1"
        value={sleepHours}
        onChange={(e) => setSleepHours(e.target.value)}
        className="w-full"
      />
      <p className="text-gray-700">😴 {sleepHours} hours</p>

      {/* 🎤 Voice Input */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">🎤 Voice Input</h3>
        <VoiceInput />
      </div>

      {/* 📁 File Upload */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">📁 File Upload</h3>
        <FileUpload />
      </div>

      {/* ✅ Submit Button */}
      <button
        className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={handleSubmit}
      >
        Submit Data
      </button>

      {/* ✅ Dashboard Button */}
      <button
        onClick={() => navigate("/dashboard")} // ✅ Navigate to Dashboard
        className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Go to Dashboard
      </button>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default DataInputFormWireframe;






