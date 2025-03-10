import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/Login.jpg";
import { api } from "../api"; // Ensure API is correctly imported

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });
      const token = response.data.token;

      if (!token) {
        setMessage("Login failed: No token received.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/data-input");
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Login Form */}
      <div style={styles.leftContainer}>
        <h2 style={styles.heading}>Welcome! Please Login or Sign In</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {message && <p style={styles.errorMessage}>{message}</p>}

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button}>Login</button>
          </div>
        </form>

        <p style={styles.registerText}>
          Don't have an account? <span style={styles.registerLink} onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>

      {/* Right Side - Image */}
      <div style={styles.rightContainer}>
        <img src={loginImage} alt="Login" style={styles.image} />
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  leftContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: "130px", // Shifted more to the right
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "370px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    padding: "12px",
    fontSize: "18px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  buttonContainer: {
    display: "flex",
    gap: "15px",
  },
  button: {
    backgroundColor: "red",
    color: "white",
    fontSize: "18px",
    padding: "12px 24px",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
  },
  rightContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: "30px", // Adjusted for better alignment
  },
  image: {
    width: "90%",  // Increased width
    height: "auto",
    maxHeight: "90vh", // Increased height slightly
    objectFit: "contain", // Ensures full visibility
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  registerText: {
    marginTop: "15px",
    fontSize: "16px",
    color: "#333",
  },
  registerLink: {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;









