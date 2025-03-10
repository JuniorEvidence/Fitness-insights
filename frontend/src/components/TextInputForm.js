import React, { useState } from "react";
import axios from "axios";
import { submitText } from "../api";

const TextInputForm = () => {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitText(text);
      setMessage(response.message);  // ✅ Show success message from backend
      setText("");  // ✅ Clear input after successful submission
    } catch (error) {
      setMessage(error.response?.data?.message || "Error submitting text");
    }
  };

  return (
    <div className="p-6 shadow-lg rounded-lg bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Submit Text Input</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Enter your text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Submit
        </button>
      </form>
      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
};

export default TextInputForm;
