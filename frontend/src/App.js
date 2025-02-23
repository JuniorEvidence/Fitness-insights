import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./styles.css"; // Import CSS

const Sidebar = () => (
  <div className="sidebar">
    <h2>Fitness Insights</h2>
    <nav>
      <Link to="/dashboard">🏠 Dashboard</Link>
      <Link to="/data-logging">📊 Data Logging</Link>
      <Link to="/settings">⚙️ Settings</Link>
      <Link to="/">🔓 Logout</Link>
    </nav>
  </div>
);

const Dashboard = () => (
  <div className="content">
    <h1>Welcome, User!</h1>
    <div className="dashboard-card">🏃‍♂️ Steps Taken: 5,000</div>
    <div className="dashboard-card">🔥 Calories Burned: 1,200 kcal</div>
    <div className="dashboard-card">⏳ Active Hours: 3</div>
  </div>
);

const DataLogging = () => (
  <div className="content">
    <h1>Data Logging</h1>
    <input type="file" className="input-field" />
    <textarea className="input-field" placeholder="Enter text..."></textarea>
  </div>
);

const Settings = () => (
  <div className="content">
    <h1>Settings</h1>
    <label>
      Dark Mode <input type="checkbox" />
    </label>
  </div>
);

const Login = () => (
  <div className="content">
    <h2>Login</h2>
    <input type="email" placeholder="Email" className="input-field" />
    <input type="password" placeholder="Password" className="input-field" />
    <button className="button">Login</button>
  </div>
);

const App = () => (
  <Router>
    <div>
      <Sidebar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data-logging" element={<DataLogging />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  </Router>
);

export default App;

