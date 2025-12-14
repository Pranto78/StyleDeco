import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react"; // ← Lucide icons
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

  const handleUpdateBooking = async (id) => {
    try {
      await axiosSecure.put(`/admin/bookings/${id}`, { status: "updated" });
      toast.success("Booking updated successfully");
      fetchPaidUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axiosSecure.delete(`/admin/bookings/${id}`);
      toast.success("Booking deleted successfully");
      fetchPaidUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
    }
  };

  const confirmDeleteBooking = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-3 bg-gray-900 text-white rounded-xl shadow-lg">
          <p className="font-semibold text-lg">
            Are you sure you want to delete this booking?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-4 py-2 bg-red-600/20 backdrop-blur-md border border-red-400/50 text-red-400 hover:bg-red-600/40 hover:text-white rounded-lg transition-all duration-300"
              onClick={async () => {
                toast.dismiss(t.id);
                await handleDeleteBooking(id);
              }}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30 text-blue-400 hover:bg-white/20 hover:text-blue-300 rounded-lg transition-all duration-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
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
              <th className="px-4 py-2 text-center font-semibold">Actions</th>
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
                <td className="px-4 py-2 text-center">
                  {user.decoratorAssigned ? (
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-gradient text-white font-bold">
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

                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleUpdateBooking(user._id)}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-blue-400/40 text-blue-400 hover:bg-white/20 hover:text-blue-300 transition-all"
                  >
                    <Edit size={18} /> {/* Lucide Edit icon */}
                  </button>
                  <button
                    onClick={() => confirmDeleteBooking(user._id)}
                    className="p-2 rounded-lg bg-red-600/20 backdrop-blur-md border border-red-400/50 text-red-400 hover:bg-red-600/40 hover:text-white transition-all"
                  >
                    <Trash2 size={18} /> {/* Lucide Trash2 icon */}
                  </button>
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
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={() => handleUpdateBooking(user._id)}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-blue-400/40 text-blue-400 hover:bg-white/20 hover:text-blue-300 transition-all"
              >
                <Edit size={18} /> {/* Lucide Edit icon */}
              </button>
              <button
                onClick={() => confirmDeleteBooking(user._id)}
                className="p-2 rounded-lg bg-red-600/20 backdrop-blur-md border border-red-400/50 text-red-400 hover:bg-red-600/40 hover:text-white transition-all"
              >
                <Trash2 size={18} /> {/* Lucide Trash2 icon */}
              </button>
            </div>
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
