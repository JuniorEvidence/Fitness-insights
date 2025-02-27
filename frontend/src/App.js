import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import DashboardWireframe from "./components/DashboardWireframe";
import DataInputFormWireframe from "./components/DataInputFormWireframe";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-semibold tracking-wide">Fitness Insights</h1>
            <p className="text-lg text-gray-600">Your personal health & wellness tracker</p>
          </header>

          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<DashboardWireframe />} />
            </Routes>
          </div>

          <div className="mt-6 w-full max-w-2xl">
            <DataInputFormWireframe />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;


