import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Edit2, Edit } from "lucide-react";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const adminToken = localStorage.getItem("adminToken");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "https://server-deco.vercel.app/admin/bookings",
        {
          headers: { "x-admin-token": adminToken },
        }
      );
      setBookings(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://server-deco.vercel.app/admin/bookings/${id}`,
        {
          headers: { "x-admin-token": adminToken },
        }
      );
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete booking");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `https://server-deco.vercel.app/admin/bookings/${id}`,
        { status: "paid" },
        { headers: { "x-admin-token": adminToken } }
      );
      toast.success("Booking updated successfully");
      fetchBookings();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update booking");
    }
  };

  // 🔥 Delete Confirmation Toast (ADDED)
  const confirmDelete = (id) => {
    toast.custom(
      (t) => (
        <div className="bg-gray-900 border border-red-500/40 shadow-2xl rounded-xl p-4 w-80">
          <h3 className="text-red-400 font-semibold text-lg mb-2">
            Delete Booking
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Are you sure you want to delete this booking? This action cannot be
            undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                handleDelete(id);
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  // 🔥 Sorting Logic
  const handleSort = (type) => {
    let sorted = [...bookings];

    if (type === "date-new") {
      sorted.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
    }

    if (type === "date-old") {
      sorted.sort((a, b) => new Date(a.bookedAt) - new Date(b.bookedAt));
    }

    if (type === "status-paid") {
      sorted.sort((a, b) => {
        if (a.status === "paid" && b.status !== "paid") return -1;
        if (a.status !== "paid" && b.status === "paid") return 1;
        return 0;
      });
    }

    if (type === "status-pending") {
      sorted.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0;
      });
    }

    setBookings(sorted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-8"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-gradient">
        Manage All Bookings
      </h2>

      {/* 🌟 Sorting UI */}
      <div className="mb-6 flex justify-start">
        <div className="bg-gray-800/40 backdrop-blur-md border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.5)] rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-blue-400 font-semibold">Sort By:</span>

          <select
            className="bg-gray-900 text-blue-300 border border-blue-600 rounded-lg px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Select</option>
            <option value="date-new">📅 Date — Newest</option>
            <option value="date-old">📅 Date — Oldest</option>
            <option value="status-paid">💰 Paid First</option>
            <option value="status-pending">⌛ Pending First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="hidden md:block bg-gray-900 rounded-2xl p-4 shadow-2xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-primary-gradient">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">#</th>
              <th className="px-4 py-2 text-left font-semibold">User Email</th>
              <th className="px-4 py-2 text-left font-semibold">Service</th>
              <th className="px-4 py-2 text-left font-semibold">Cost</th>
              <th className="px-4 py-2 text-left font-semibold">
                Booking Date
              </th>
              <th className="px-4 py-2 text-left font-semibold">Payment</th>
              <th className="px-4 py-2 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {bookings.map((b, i) => (
              <motion.tr
                key={b._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{b.userEmail}</td>
                <td className="px-4 py-2 text-primary-gradient font-semibold">
                  {b.serviceName}
                </td>
                <td className="px-4 py-2 text-green-400">৳{b.cost}</td>
                <td className="px-4 py-2">
                  {new Date(b.bookedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "paid" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {b.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </td>

                <td className="px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() => handleUpdate(b._id)}
                    className="p-2 bg-white/10 border border-blue-400/40 text-blue-400 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => confirmDelete(b._id)}
                    className="p-2 bg-red-600/20 border border-red-400/50 text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {bookings.map((b, i) => (
          <motion.div key={b._id} className="bg-gray-800 p-4 rounded-xl">
            <div className="flex justify-between">
              <span className="text-primary-gradient font-semibold">
                #{i + 1}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(b._id)}
                  className="p-2 bg-blue-600 rounded-lg"
                >
                  <Edit className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => confirmDelete(b._id)}
                  className="p-2 bg-red-600 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ManageBooking;
