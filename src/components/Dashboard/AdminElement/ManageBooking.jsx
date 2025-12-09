import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <h2 className="text-3xl font-bold mb-6">Manage All Bookings</h2>

      <div className="overflow-x-auto bg-gray-900 rounded-xl p-4 shadow-xl">
        <table className="table text-white w-full">
          <thead className="bg-gray-800 text-purple-300 text-lg">
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Service</th>
              <th>Cost</th>
              <th>Booking Date</th>
              <th>Payment</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b, i) => (
              <motion.tr
                key={b._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 hover:bg-gray-700"
              >
                <td>{i + 1}</td>
                <td>{b.userEmail}</td>
                <td className="text-purple-400 font-semibold">
                  {b.serviceName}
                </td>
                <td className="text-green-400">৳{b.cost}</td>
                <td>{new Date(b.bookedAt).toLocaleDateString()}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      b.status === "paid" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {b.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManageBooking;
