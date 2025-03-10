import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from "recharts";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/generate-insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({}),
        });

        const result = await response.json();
        console.log("📊 API Response:", result);

        if (result.insights && Array.isArray(result.insights)) {
          const formattedData = result.insights.map((entry) => ({
            date: entry.date || "N/A",
            steps_walked: Number(entry.steps_walked) || 0,
            calories_burnt: Number(entry.calories_burnt) || 0,
            sleep_hours: Number(entry.sleep_hours) || 0,
            weight_difference: Number(entry.weight_difference) || 0,
          }));

          console.log("🔹 Formatted Data for Graphs:", formattedData);
          setData(formattedData);
        } else {
          setError("No insights available. Please log some data.");
          console.error("🚨 Missing insights in API response or invalid format");
        }
      } catch (error) {
        console.error("🚨 Error fetching insights:", error);
        setError("Failed to fetch insights. Check your API.");
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <LayoutDashboard className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Fitness Dashboard</h1>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Steps Walked */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Steps Walked Per Day</h2>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="steps_walked" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>

          {/* Calories Burnt */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Calories Burnt Per Day</h2>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calories_burnt" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>

          {/* Sleep Hours */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Sleep Hours Per Day</h2>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sleep_hours" stroke="#ff7300" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>

          {/* Weight Change */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Weight Change Per Month</h2>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="weight_difference" fill="#d88484" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


