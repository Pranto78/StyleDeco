// src/components/Dashboard/AnalyticsPieChart.jsx
import React, { useEffect, useState } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsCharts = () => {
  const axiosSecure = UseAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosSecure.get("/admin/bookings");
        const bookings = res.data;

        const total = bookings.length;
        const assigned = bookings.filter((b) => b.decoratorAssigned).length;
        const unassigned = total - assigned;

        const paid = bookings.filter((b) => b.status === "paid").length;
        const pending = total - paid;

        setStats({
          total,
          assigned,
          unassigned,
          paid,
          pending,
        });
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // -------------------------
  // DECORATOR ASSIGNMENT PIE
const decoratorData = {
  labels: ["Assigned to Decorators", "Not Assigned"],
  datasets: [
    {
      data: [stats.assigned, stats.unassigned],
      backgroundColor: ["rgba(99,102,241,0.95)", "rgba(239,68,68,0.9)"],
      borderWidth: 0,
      spacing: 5, 
      borderRadius: 2, 
      hoverOffset: 12, 
    },
  ],
};

const paymentData = {
  labels: ["Paid Bookings", "Pending Bookings"],
  datasets: [
    {
      data: [stats.paid, stats.pending],
      backgroundColor: ["rgba(34,197,94,0.95)", "rgba(234,179,8,0.95)"],
      borderWidth: 0,
      spacing: 5,
      borderRadius: 2,
      hoverOffset: 12,
    },
  ],
};


 const options = {
   responsive: true,
   maintainAspectRatio: false,
   cutout: "70%", // thinner ring = premium
   plugins: {
     legend: {
       position: "bottom",
       labels: {
         color: "#e5e7eb",
         font: { size: 12, weight: "500" },
         padding: 16,
       },
     },
     tooltip: {
       backgroundColor: "rgba(0,0,0,0.85)",
       titleColor: "#fff",
       bodyColor: "#fff",
       padding: 14,
       cornerRadius: 8,
     },
   },
   animation: {
     duration: 900,
     easing: "easeOutQuart",
   },
 };

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 bg-transparent rounded-3xl shadow-xl border border-gray-300/10">
      {/* DECORATOR RATIO */}
      <div className="bg-transparent rounded-xl p-5 flex flex-col items-center">
        <h3 className="text-white text-base font-semibold mb-3">
          Decorator Assignment
        </h3>

        <div className="w-[220px] h-[220px]">
          <Doughnut data={decoratorData} options={options} />
        </div>

        <p className="text-gray-400 mt-3 text-sm">
          Total Bookings: {stats.total}
        </p>
      </div>

      {/* PAYMENT RATIO */}
      <div className="bg-transparent  rounded-xl p-5 flex flex-col items-center">
        <h3 className="text-white text-base font-semibold mb-3">
          Payment Status
        </h3>

        <div className="w-[220px] h-[220px]">
          <Doughnut data={paymentData} options={options} />
        </div>

        <p className="text-gray-400 mt-3 text-sm">
          Paid: {stats.paid} | Pending: {stats.pending}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
