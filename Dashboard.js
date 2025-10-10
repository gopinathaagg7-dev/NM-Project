import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ users: 0, sales: 0, views: 0 });
  const [salesHistory, setSalesHistory] = useState([]);

  // ✅ Fetch metrics from backend
  const fetchMetrics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/metrics");
      setMetrics(res.data);

      // Push to history for line chart (keep only last 10 points)
      setSalesHistory((prev) => {
        const newData = [
          ...prev,
          { time: new Date().toLocaleTimeString(), sales: res.data.sales },
        ];
        return newData.slice(-10);
      });
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  // ✅ Fetch initially + every 5 seconds
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Bar chart data
  const barData = {
    labels: ["Users", "Sales", "Views"],
    datasets: [
      {
        label: "Metrics",
        data: [metrics.users, metrics.sales, metrics.views],
        backgroundColor: ["#3b82f6", "#10b981", "#06b6d4"],
      },
    ],
  };

  // ✅ Line chart data
  const lineData = {
    labels: salesHistory.map((d) => d.time),
    datasets: [
      {
        label: "Sales Over Time",
        data: salesHistory.map((d) => d.sales),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.3)",
        fill: true,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Admin Dashboard</h2>

      <div style={{ marginBottom: "2rem" }}>
        <Bar data={barData} />
      </div>

      <div>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default Dashboard;
