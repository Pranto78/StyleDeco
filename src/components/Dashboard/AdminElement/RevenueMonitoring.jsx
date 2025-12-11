// src/components/Dashboard/RevenueMonitoring.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueMonitoring = () => {
  const axiosSecure = UseAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get("/payments");
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [axiosSecure]);

  // Aggregate revenue by service
  const revenueData = payments.reduce((acc, payment) => {
    const serviceName = payment.serviceName || "Unknown Service";
    if (!acc[serviceName]) acc[serviceName] = 0;
    acc[serviceName] += payment.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(revenueData),
    datasets: [
      {
        label: "Revenue (BDT)",
        data: Object.values(revenueData),
        borderColor: "rgba(37, 99, 235, 1)",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(37, 99, 235, 0.3)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(37, 99, 235, 0.1)");
          gradient.addColorStop(1, "rgba(37, 99, 235, 0.4)");
          return gradient;
        },
        tension: 0.4, // smooth curve
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#ffffff", font: { size: 12 } },
      },
      title: {
        display: true,
        text: "Revenue Monitoring",
        color: "#ffffff",
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
        ticks: { color: "#ffffff", font: { size: 12 } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  if (loading) return <p className="text-white">Loading revenue...</p>;

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg w-full">
      {payments.length === 0 ? (
        <p className="text-white">No payments found yet.</p>
      ) : (
        <div style={{ width: "100%", minHeight: "350px" }}>
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default RevenueMonitoring;
