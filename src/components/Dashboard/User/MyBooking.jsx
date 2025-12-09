import React, { useEffect, useState } from "react";
// import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const MyBooking = () => {
  const axiosSecure = UseAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosSecure.get("/bookings");
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Booking fetch error:", err);
        toast.error("Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [axiosSecure]);

  if (loading)
    return (
      <p className="text-center text-xl mt-20 text-gray-400">
        Loading your bookings...
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 max-w-6xl mx-auto text-white"
    >
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven't booked any service yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl">
          <table className="table w-full text-white">
            <thead>
              <tr className="bg-gray-800 text-purple-300 text-lg">
                <th>#</th>
                <th>Service Name</th>
                <th>Cost</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, index) => (
                <motion.tr
                  key={b._id}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-900 hover:bg-gray-800 text-lg"
                >
                  <td className="py-4">{index + 1}</td>

                  <td className="font-semibold text-purple-400">
                    {b.serviceName}
                  </td>

                  <td className="text-green-400">৳{b.cost.toLocaleString()}</td>

                  <td>{new Date(b.bookedAt).toLocaleDateString()}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        b.status === "pending"
                          ? "bg-yellow-600 text-yellow-100"
                          : "bg-green-600 text-green-100"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td>
                    {b.status === "pending" ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        onClick={() =>
                          toast.success("Payment gateway coming soon!")
                        }
                      >
                        Pay Now
                      </motion.button>
                    ) : (
                      <span className="text-green-400 font-semibold">Paid</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default MyBooking;
