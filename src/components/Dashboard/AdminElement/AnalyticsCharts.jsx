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
        backgroundColor: "rgba(99, 102, 241, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Histogram: Services Booked by Users" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  if (loading) return <p>Loading chart...</p>;

  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow">
      {bookings.length === 0 ? (
        <p>No booking data found.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default AnalyticsCharts;
