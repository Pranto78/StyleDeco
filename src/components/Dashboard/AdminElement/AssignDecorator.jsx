import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
// import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import AssignDecoratorModal from "./AssignDecoratorModal"; // modal component we'll create
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AssignDecorator = () => {
  const axiosSecure = UseAxiosSecure();
  const [paidUsers, setPaidUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch paid bookings/users
  const fetchPaidUsers = async () => {
    try {
      const res = await axiosSecure.get("/admin/bookings");
      // filter paid
      const paid = res.data.filter((b) => b.status === "paid");
      setPaidUsers(paid);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch paid bookings");
    }
  };

  useEffect(() => {
    fetchPaidUsers(); // initial fetch

    const interval = setInterval(fetchPaidUsers, 5000); // auto refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalOpen(false);
  };

  const handleAssign = async (decoratorEmail) => {
    try {
      await axiosSecure().post("/admin/assign-decorator", {
        email: decoratorEmail,
        bookingId: selectedBooking._id,
      });

      toast.success(
        `${decoratorEmail} assigned to ${selectedBooking.userEmail}`
      );

      // Update table optimistically
      setPaidUsers((prev) =>
        prev.map((u) =>
          u._id === selectedBooking._id ? { ...u, decoratorAssigned: true } : u
        )
      );

      closeModal();
    } catch (err) {
      console.error(err);
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
      <h2 className="text-3xl font-bold mb-6">Manage Decorators</h2>

      <div className="overflow-x-auto bg-gray-900 rounded-xl p-4 shadow-xl">
        <table className="table text-white w-full">
          <thead className="bg-gray-800 text-purple-300 text-lg">
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Service</th>
              <th>Cost</th>
              <th>Booking Date</th>
              <th>Decorator</th>
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
                      Assigned
                    </span>
                  ) : (
                    <button
                      onClick={() => openModal(user)}
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

      {modalOpen && (
        <AssignDecoratorModal
          booking={selectedBooking}
          onClose={closeModal}
          onAssign={handleAssign}
        />
      )}
    </motion.div>
  );
};

export default AssignDecorator;
