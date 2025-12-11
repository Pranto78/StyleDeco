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
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.4, // smooth curve
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Revenue Monitoring" },
    },
  };

  if (loading) return <p>Loading revenue...</p>;

  return (
    <div className="p-4 bg-gray-300 rounded-lg shadow">
      {payments.length === 0 ? (
        <p>No payments found yet.</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default RevenueMonitoring;
