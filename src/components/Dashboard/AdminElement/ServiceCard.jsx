import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const ServiceCard = ({ service, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...service });

  const adminToken = localStorage.getItem("adminToken");

  // ------------------- UPDATE SERVICE -------------------
  const handleUpdate = async () => {
    try {
      await axios.patch(
        `https://server-deco.vercel.app/services/${service._id}`,
        editData,
        {
          headers: { "x-admin-token": adminToken },
        }
      );

      toast.success("Service updated!");
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // ------------------- DELETE CONFIRM TOAST -------------------
  const handleDeleteToast = () => {
    toast.custom((t) => (
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-xl border border-white/10">
        <p className="font-semibold text-lg">Delete this service?</p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleDeleteConfirmed();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold"
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  // ------------------- FINAL DELETE -------------------
  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(
        `https://server-deco.vercel.app/services/${service._id}`,
        {
          headers: { "x-admin-token": adminToken },
        }
      );

      toast.success("Service deleted");
      onDelete();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-transparent-md backdrop-blur-lg border border-white/20 rounded-2xl 
      shadow-xl overflow-hidden flex flex-col h-full"
    >
      {/* ------------------- EDIT MODE ------------------- */}
      {isEditing ? (
        <div className="p-6 space-y-3">
          <input
            type="text"
            value={editData.service_name}
            onChange={(e) =>
              setEditData({ ...editData, service_name: e.target.value })
            }
            className="w-full p-2 rounded bg-white/20 text-white outline-none"
            placeholder="Service Name"
          />

          <input
            type="number"
            value={editData.cost}
            onChange={(e) => setEditData({ ...editData, cost: e.target.value })}
            className="w-full p-2 rounded bg-white/20 text-white outline-none"
            placeholder="Cost"
          />

          <input
            type="text"
            value={editData.service_category}
            onChange={(e) =>
              setEditData({ ...editData, service_category: e.target.value })
            }
            className="w-full p-2 rounded bg-white/20 text-white outline-none"
            placeholder="Category"
          />

          <textarea
            rows="3"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="w-full p-2 rounded bg-white/20 text-white outline-none"
            placeholder="Description"
          />

          <input
            type="text"
            value={editData.image}
            onChange={(e) =>
              setEditData({ ...editData, image: e.target.value })
            }
            className="w-full p-2 rounded bg-white/20 text-white outline-none"
            placeholder="Image URL"
          />

          {editData.image && (
            <img
              src={editData.image}
              className="w-full h-32 object-cover rounded-lg border border-white/20 mt-2"
              alt="preview"
            />
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ------------------- NORMAL VIEW ------------------- */}
          <img
            src={service.image || "/placeholder.jpg"}
            className="w-full h-48 object-cover"
          />

          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">
              {service.service_name}
            </h3>

            <p className="text-gray-300 text-sm mb-4 flex-grow">
              {service.description}
            </p>

            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-green-400">
                ৳{service.cost}
              </span>
              <span className="px-3 py-1 bg-blue-600/40 text-white rounded-full text-xs">
                {service.service_category}
              </span>
            </div>

            <div className="flex gap-2">
              {/* ------------------- EDIT BUTTON ------------------- */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex-1 btn-primary-gradient text-white py-2 rounded-lg font-semibold shadow-lg"
              >
                Edit
              </motion.button>

              {/* ------------------- DELETE BUTTON ------------------- */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteToast}
                className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white py-2 rounded-lg font-semibold shadow-lg"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ServiceCard;
