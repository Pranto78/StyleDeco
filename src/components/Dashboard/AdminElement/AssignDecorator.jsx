import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AssignDecoratorModal from "./AssignDecoratorModal";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AssignDecorator = () => {
  const axiosSecure = UseAxiosSecure();
  const [paidUsers, setPaidUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchPaidUsers = async () => {
    try {
      const res = await axiosSecure.get("/admin/bookings");
      const paid = res.data.filter((b) => b.status === "paid");
      setPaidUsers(paid);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch paid bookings");
    }
  };

  useEffect(() => {
    fetchPaidUsers();
    const interval = setInterval(fetchPaidUsers, 5000);
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
      await axiosSecure.post("/admin/assign-decorator", {
        email: decoratorEmail,
        bookingId: selectedBooking._id,
      });
      toast.success(
        `${decoratorEmail} assigned to ${selectedBooking.userEmail}`
      );
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
      className="p-4 sm:p-8"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-gradient p-3">
        Manage Decorators
      </h2>

      {/* Table view for md+ screens */}
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
              <th className="px-4 py-2 text-center font-semibold">Decorator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paidUsers.map((user, i) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-transparent transition-colors duration-200"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2 break-words">{user.userEmail}</td>
                <td className="px-4 py-2 text-primary-gradient font-semibold break-words">
                  {user.serviceName}
                </td>
                <td className="px-4 py-2 text-green-400">৳{user.cost}</td>
                <td className="px-4 py-2">
                  {new Date(user.bookedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex justify-center">
                  {user.decoratorAssigned ? (
                    <span className="px-3 py-1 rounded-full bg-primary-gradient text-white font-bold">
                      Assigned
                    </span>
                  ) : (
                    <button
                      onClick={() => openModal(user)}
                      className="px-3 py-1 rounded-lg bg-blue-400 text-white font-bold hover:bg-blue-500 shadow-md"
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

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {paidUsers.map((user, i) => (
          <motion.div
            key={user._id}
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
                {user.decoratorAssigned ? (
                  <span className="px-3 py-1 rounded-full bg-green-600 text-white font-bold">
                    Assigned
                  </span>
                ) : (
                  <button
                    onClick={() => openModal(user)}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-md"
                  >
                    Assign
                  </button>
                )}
              </div>
            </div>
            <p className="text-white text-sm break-words">
              <strong>User:</strong> {user.userEmail}
            </p>
            <p className="text-primary-gradient font-semibold text-sm break-words">
              <strong>Service:</strong> {user.serviceName}
            </p>
            <p className="text-green-400 text-sm">
              <strong>Cost:</strong> ৳{user.cost}
            </p>
            <p className="text-white text-sm">
              <strong>Booking Date:</strong>{" "}
              {new Date(user.bookedAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
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
