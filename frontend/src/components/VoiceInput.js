import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

const VoiceInput = () => {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ Use WebM (default) with Opus codec for better browser support
  const { startRecording, stopRecording, mediaBlobUrl, status } =
    useReactMediaRecorder({
      audio: true,
      mimeType: "audio/webm;codecs=opus", // ✅ WebM with Opus codec
      echoCancellation: true,
      autoGainControl: true,
      noiseSuppression: true,
    });

  // ✅ Upload the recorded audio
  const handleUpload = async () => {
    if (!mediaBlobUrl) {
      setMessage("No audio recorded!");
      return;
    }
  
    try {
      setUploading(true);
  
      // ✅ Fetch recorded audio
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      
      console.log("🎧 Playing recorded audio before upload...");
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play(); // ✅ Listen to confirm there's sound before upload
  
      const formData = new FormData();
      formData.append("audio", blob, "audio.wav");
  
      const token = localStorage.getItem("token");
      const uploadResponse = await axios.post(
        "http://127.0.0.1:5000/submit-audio",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("✅ Upload Response:", uploadResponse.data);
      setMessage(uploadResponse.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error processing audio");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 shadow-lg rounded-lg bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Voice Input</h2>
      <p className="mb-2">Status: {status}</p>

      <div className="flex space-x-2">
        <button
          onClick={startRecording}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          🎙️ Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          ⏹️ Stop Recording
        </button>
      </div>

      {mediaBlobUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">🔊 Recorded Audio Preview:</p>
          <audio src={mediaBlobUrl} controls className="w-full" />

          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "📤 Upload Recording"}
          </button>
        </div>
      )}

      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
};

export default VoiceInput;




