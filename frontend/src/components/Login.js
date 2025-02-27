import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });
      setMessage("Login Successful!");
      localStorage.setItem("token", response.data.access_token);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-2 text-green-500">{message}</p>}

      {/* Add Register Link */}
      <p className="mt-4 text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500">
          Register Here
        </Link>
      </p>
    </div>
  );
};

export default Login;





