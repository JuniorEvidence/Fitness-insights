import React, { useState } from "react";
import { uploadFile } from "../api"; // ✅ Import API function

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first.");
      return;
    }

    try {
      const response = await uploadFile(file); // ✅ Use API function

      setMessage(response.message);
      setFile(null); // ✅ Reset file input after upload
    } catch (error) {
      setMessage("❌ Error uploading file.");
    }
  };

  return (
    <div className="p-6 shadow-lg rounded-lg bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload File</h2>
      <input type="file" onChange={handleFileChange} className="border p-2 w-full mb-2" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Upload
      </button>
      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
};

export default FileUpload;

