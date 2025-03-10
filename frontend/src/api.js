// src/api.js
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // Change if your Flask server is running elsewhere

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Function to submit text input
export const submitText = async (text) => {
  try {
    const token = localStorage.getItem("token");

    console.log("🔹 Sending JWT in Request:", token);

    const response = await axios.post(
      `${API_BASE_URL}/submit-text`,
      { text },
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      }
    );

    console.log("✅ Response from Server:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error submitting text:", error.response?.data || error);
    throw error;
  }
};

// ✅ Function to submit voice input
export const submitVoice = async (audioBlob) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    console.log("🔹 Sending Audio to Backend...");
    
    const response = await api.post("/submit-audio", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Response from Server:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error submitting voice:", error.response?.data || error);
    throw error;
  }
};

// ✅ Function to upload a file (photo/video)
export const uploadFile = async (file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData object

    console.log("🔹 Uploading File...");

    const response = await axios.post(`${API_BASE_URL}/upload-media`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ File Upload Successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error uploading file:", error.response?.data || error);
    throw error;
  }
};

// Function to get JWT token from local storage
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};