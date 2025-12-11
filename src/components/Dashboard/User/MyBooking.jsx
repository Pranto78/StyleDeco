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
      <div className="flex items-center justify-center min-h-screen bg-transparent bg-opacity-20">
        <span className="loading loading-infinity loading-xl text-6xl text-blue-500"></span>
      </div>
    );

    const handelPayment = async (booking) => {
      try {
        const paymentInfo = {
          cost: booking.cost,
          bookId: booking._id,
          senderEmail: booking.userEmail,
          serviceName: booking.serviceName,
        };

        const res = await axiosSecure.post(
          "/create-checkout-session",
          paymentInfo
        );

        if (res.data.url) {
          window.location.href = res.data.url; // redirect to Stripe
        }
         else {
          toast.error("Failed to start payment session");
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Payment initialization failed");
      }
    };


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-8 w-full max-w-6xl mx-auto text-white"
    >
      <h1 className="text-3xl text-primary-gradient font-bold mb-6">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven't booked any service yet.
        </p>
      ) : (
        <>
          {/* Table for large screens */}
          <div className="hidden lg:block overflow-x-auto rounded-xl shadow-xl">
            <table className="table w-full text-white">
              <thead>
                <tr className="bg-transparent text-primary-gradient text-lg">
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
                    className="bg-transparent text-lg"
                  >
                    <td className="py-4">{index + 1}</td>
                    <td className="font-semibold text-purple-400">
                      {b.serviceName}
                    </td>
                    <td className="text-green-400">
                      ৳{b.cost.toLocaleString()}
                    </td>
                    <td>{new Date(b.bookedAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          b.status === "pending"
                            ? "bg-yellow-600 text-white font-bold"
                            : "bg-primary-gradient text-white font-bold"
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
                          className="px-4 py-2 rounded-lg btn-primary-gradient text-white shadow-lg"
                          onClick={() => handelPayment(b)}
                        >
                          Pay Now
                        </motion.button>
                      ) : (
                        <span className="text-primary-gradient font-semibold">
                          Paid
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for mobile/small screens */}
          <div className="lg:hidden space-y-4">
            {bookings.map((b, index) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-800 rounded-xl p-4 shadow-lg"
              >
                <h2 className="font-semibold text-purple-400 text-lg">
                  {b.serviceName}
                </h2>
                <p className="text-green-400 font-semibold">
                  Cost: ৳{b.cost.toLocaleString()}
                </p>
                <p>Booking Date: {new Date(b.bookedAt).toLocaleDateString()}</p>
                <p>
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-lg text-sm ${
                      b.status === "pending"
                        ? "bg-yellow-600 text-white font-bold"
                        : "bg-primary-gradient text-white font-bold"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>
                {b.status === "pending" ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="mt-2 px-4 py-2 rounded-lg btn-primary-gradient text-white shadow-lg"
                    onClick={() => handelPayment(b)}
                  >
                    Pay Now
                  </motion.button>
                ) : (
                  <span className="text-primary-gradient font-semibold mt-2 block">
                    Paid
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MyBooking;
