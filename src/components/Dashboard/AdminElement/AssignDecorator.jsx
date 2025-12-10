import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const AssignDecorator = () => {
  const [paidUsers, setPaidUsers] = useState([]);
  const adminToken = localStorage.getItem("adminToken");

  // Fetch paid bookings/users
  const fetchPaidUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/bookings", {
        headers: { "x-admin-token": adminToken },
      });

      // Filter only paid users
      const paid = res.data.filter((b) => b.status === "paid");
      setPaidUsers(paid);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch paid bookings");
    }
  };

  useEffect(() => {
    fetchPaidUsers(); // initial fetch

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchPaidUsers();
    }, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

 const assignDecorator = async (userEmail, bookingId) => {
   try {
     await axios.post(
       "http://localhost:3000/admin/assign-decorator",
       { email: userEmail, bookingId },
       { headers: { "x-admin-token": adminToken } }
     );

     toast.success(`${userEmail} is now a decorator!`);

     // Optimistically update table
     setPaidUsers((prev) =>
       prev.map((u) =>
         u._id === bookingId ? { ...u, decoratorAssigned: true } : u
       )
     );
   } catch (error) {
     console.error(error);
     toast.error("Failed to assign decorator");
   }
 };


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <h2 className="text-3xl font-bold mb-6">Assign Decorators</h2>

      <div className="overflow-x-auto bg-gray-900 rounded-xl p-4 shadow-xl">
        <table className="table text-white w-full">
          <thead className="bg-gray-800 text-purple-300 text-lg">
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Service</th>
              <th>Cost</th>
              <th>Booking Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paidUsers.map((user, i) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 hover:bg-gray-700"
              >
                <td>{i + 1}</td>
                <td>{user.userEmail}</td>
                <td className="text-purple-400 font-semibold">
                  {user.serviceName}
                </td>
                <td className="text-green-400">৳{user.cost}</td>
                <td>{new Date(user.bookedAt).toLocaleDateString()}</td>
                <td>
                  {user.decoratorAssigned ? (
                    <span className="px-3 py-1 rounded-lg bg-green-600 text-white font-bold">
                      Decorator
                    </span>
                  ) : (
                    <button
                      onClick={() => assignDecorator(user.userEmail, user._id)}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500"
                    >
                      Assign
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AssignDecorator;
