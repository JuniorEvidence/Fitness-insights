import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import DashboardWireframe from "./components/DashboardWireframe";
import DataInputFormWireframe from "./components/DataInputFormWireframe";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-semibold tracking-wide text-white">Fitness Insights</h1>
            <p className="text-lg text-gray-400">Your personal health & wellness tracker</p>
          </header>

          <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><DashboardWireframe /></PrivateRoute>} />
              <Route path="/data-input" element={<PrivateRoute><DataInputFormWireframe /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;




