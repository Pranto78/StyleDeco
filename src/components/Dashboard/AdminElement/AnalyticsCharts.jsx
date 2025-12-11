// src/components/Dashboard/AnalyticsCharts.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsCharts = () => {
  const axiosSecure = UseAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosSecure.get("/admin/bookings");
        setBookings(res.data);
      } catch (error) {
        console.error("Error loading histogram data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchBookings, 5000);

    return () => clearInterval(interval);
  }, [axiosSecure]);

  const bookingCount = bookings.reduce((acc, b) => {
    acc[b.userEmail] = (acc[b.userEmail] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(bookingCount),
    datasets: [
      {
        label: "Number of Services Booked",
        data: Object.values(bookingCount),
        backgroundColor: (context) => {
          // Gradient effect for bars
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(99, 102, 241, 0.7)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.7)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0.9)");
          return gradient;
        },
        borderRadius: 6, // Rounded bars
        barPercentage: 0.6, // Thinner bars for mobile
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Full responsiveness
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#ffffff" }, // White legend for dark theme
      },
      title: {
        display: true,
        text: "Services Booked by Users",
        color: "#ffffff", // White title for dark theme
        font: { size: 18, weight: "600" },
      },
      tooltip: {
        bodyColor: "#ffffff",
        titleColor: "#ffffff",
        backgroundColor: "rgba(0,0,0,0.8)",
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff", font: { size: 12 } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#ffffff", font: { size: 12 } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  if (loading) return <p className="text-white">Loading chart...</p>;

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg w-full">
      {bookings.length === 0 ? (
        <p className="text-white">No booking data found.</p>
      ) : (
        <div style={{ width: "100%", minHeight: "350px" }}>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default AnalyticsCharts;
