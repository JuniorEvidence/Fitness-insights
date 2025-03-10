import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";

const Dashboard = () => {
  const [data, setData] = useState([]);

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
        console.log("📊 API Response:", result); // ✅ Debugging
    
        if (result.insights && Array.isArray(result.insights)) {
          // ✅ Ensure all numerical values are converted properly
          const formattedData = result.insights.map((entry) => ({
            ...entry,
            steps_walked: Number(entry.steps_walked) || 0,
            calories_burnt: Number(entry.calories_burnt) || 0,
            sleep_hours: Number(entry.sleep_hours) || 0,
            weight_difference: Number(entry.weight_difference) || 0,
          }));
    
          console.log("🔹 Formatted Data for Graphs:", formattedData); // ✅ Check formatted data
          setData(formattedData);
        } else {
          console.error("🚨 Missing insights in API response or invalid format");
        }
      } catch (error) {
        console.error("🚨 Error fetching insights:", error);
      }
    };
  
    fetchInsights();
  }, []);
  

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Health Insights</h1>

      {/* Steps Walked Per Day - Line Chart */}
      <h2 className="text-xl font-semibold mb-2">Steps Walked Per Day</h2>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="steps_walked" stroke="#8884d8" />
      </LineChart>

      {/* Calories Burnt Per Day - Bar Chart */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Calories Burnt Per Day</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="calories_burnt" fill="#82ca9d" />
      </BarChart>

      {/* Sleep Taken Per Day - Line Chart */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Sleep Taken Per Day</h2>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sleep_hours" stroke="#ff7300" />
      </LineChart>

      {/* Weight Change Per Month - Bar Chart */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Weight Change Per Month</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="weight_difference" fill="#d88484" />
      </BarChart>
    </div>
  );
};

export default Dashboard;


