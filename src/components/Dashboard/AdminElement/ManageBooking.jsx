import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Edit2 } from "lucide-react";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const adminToken = localStorage.getItem("adminToken");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/bookings", {
        headers: { "x-admin-token": adminToken },
      });
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
      await axios.delete(`http://localhost:3000/admin/bookings/${id}`, {
        headers: { "x-admin-token": adminToken },
      });
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
        `http://localhost:3000/admin/bookings/${id}`,
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

      {/* Table for medium+ screens */}
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
                className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2 break-words">{b.userEmail}</td>
                <td className="px-4 py-2 text-primary-gradient font-semibold break-words">
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
                    title="Update"
                    className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
                  >
                    <Edit2 className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    title="Delete"
                    className="p-2 bg-red-600 hover:bg-red-500 rounded-lg shadow-md"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {bookings.map((b, i) => (
          <motion.div
            key={b._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-800 p-4 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary-gradient font-semibold">
                #{i + 1}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(b._id)}
                  className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
                  title="Update"
                >
                  <Edit2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="p-2 bg-red-600 hover:bg-red-500 rounded-lg shadow-md"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <p className="text-white text-sm break-words">
              <strong>User:</strong> {b.userEmail}
            </p>
            <p className="text-primary-gradient font-semibold text-sm break-words">
              <strong>Service:</strong> {b.serviceName}
            </p>
            <p className="text-green-400 text-sm">
              <strong>Cost:</strong> ৳{b.cost}
            </p>
            <p className="text-white text-sm">
              <strong>Booking Date:</strong>{" "}
              {new Date(b.bookedAt).toLocaleDateString()}
            </p>
            <p>
              <span
                className={`px-3 py-1 mt-2 inline-block rounded-full text-xs font-semibold ${
                  b.status === "paid" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {b.status === "paid" ? "Paid" : "Pending"}
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ManageBooking;
