import React, { useEffect, useState, useCallback } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const EarningSummary = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = UseAxiosSecure();

  const fetchEarnings = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/decorator/payments");
      setPayments(res.data || []);
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchEarnings();
    const interval = setInterval(fetchEarnings, 8000);
    return () => clearInterval(interval);
  }, [fetchEarnings]);

  const paidPayments = payments.filter((p) => p.status === "paid");
  const totalEarnings = paidPayments.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

  const chartData = Object.values(
    paidPayments.reduce((acc, payment) => {
      const name = payment.serviceName || "Unknown Service";
      if (!acc[name]) acc[name] = { name, amount: 0 };
      acc[name].amount += Number(payment.amount || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.amount - a.amount);

  // Dynamic max value for Y-axis (adds 20% headroom)
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 10000);
  const yAxisDomain = [0, maxAmount * 1.25]; // 25% extra space on top

  const BLUE_COLORS = ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl font-medium text-blue-400 animate-pulse">
          Loading earnings...
        </div>
      </div>
    );
  }

  if (paidPayments.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-7xl mb-6 text-blue-500">Chart Increasing</div>
          <h2 className="text-3xl font-bold text-gray-200 mb-4">
            No Earnings Yet
          </h2>
          <p className="text-gray-400 text-lg">
            Your earnings will appear here as soon as clients pay for your
            services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Earning Summary
        </h2>
        <div className="inline-flex items-baseline gap-4">
          <span className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            BDT {totalEarnings.toLocaleString()}
          </span>
          <span className="text-2xl font-light text-blue-300">earned</span>
        </div>
      </div>

      {/* Glass Chart Card */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/10 via-blue-500/5 to-cyan-500/5 border border-blue-400/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-600/10" />

        <div className="relative p-8 pb-12">
          <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-4">
            <div className="w-2 h-12 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-500/50" />
            Earnings by Service
          </h3>

          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={chartData}
              barSize={70}
              margin={{ top: 20, right: 40, left: 60, bottom: 100 }} // Increased margins!
            >
              <defs>
                <linearGradient
                  id="blueBarGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              {/* XAxis - Fully visible long labels */}
              <XAxis
                dataKey="name"
                tick={{ fill: "#cbd5e1", fontSize: 13, fontWeight: 500 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={120} // Critical: gives space for long rotated labels
                interval={0} // Show all labels
              />

              {/* YAxis - Dynamic, no cropping */}
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
                domain={yAxisDomain} // Auto-scale with headroom
                allowDataOverflow={false}
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `BDT ${(value / 1000000).toFixed(1)}M`
                    : value >= 1000
                    ? `BDT ${(value / 1000).toFixed(0)}K`
                    : `BDT ${value}`
                }
              />

              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.97)",
                  border: "1px solid #3b82f6",
                  borderRadius: "16px",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(59,130,246,0.3)",
                }}
                labelStyle={{ color: "#e0f2fe", fontWeight: 600 }}
                itemStyle={{ color: "#60a5fa", fontWeight: "bold" }}
                formatter={(value) => `BDT ${Number(value).toLocaleString()}`}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />

              <Bar
                dataKey="amount"
                fill="url(#blueBarGradient)"
                radius={[20, 20, 0, 0]}
                animationDuration={1400}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BLUE_COLORS[index % BLUE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="rounded-3xl backdrop-blur-2xl bg-white/5 border border-blue-400/20 shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-cyan-600/20 border-b border-blue-400/30">
          <h3 className="text-2xl font-bold text-white">Payment History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-blue-200 border-b border-blue-400/20">
                <th className="px-8 py-5 font-medium">Service</th>
                <th className="px-8 py-5 font-medium">Amount</th>
                <th className="px-8 py-5 font-medium">Client</th>
                <th className="px-8 py-5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {paidPayments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-blue-400/10 hover:bg-blue-500/5 transition-all duration-300"
                >
                  <td className="px-8 py-6 text-white font-medium">
                    {p.serviceName}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-blue-300 font-bold text-lg">
                      BDT {Number(p.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-gray-300">{p.senderEmail}</td>
                  <td className="px-8 py-6 text-blue-200">
                    {new Date(p.paidAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningSummary;
