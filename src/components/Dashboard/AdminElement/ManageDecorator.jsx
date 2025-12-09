import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const ManageDecorator = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  const adminToken = localStorage.getItem("adminToken");

  // Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:3000/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Delete service
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await axios.delete(`http://localhost:3000/services/${id}`, {
        headers: { "x-admin-token": adminToken },
      });

      toast.success("Service deleted");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // Update submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:3000/services/${editingService._id}`,
        editingService,
        {
          headers: { "x-admin-token": adminToken },
        }
      );

      toast.success("Service updated successfully");
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Manage All Services</h2>

      {/* SERVICE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <motion.div
            key={s._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
          >
            <img
              src={s.image}
              className="h-40 w-full object-cover rounded-lg"
              alt=""
            />

            <h3 className="text-xl font-bold mt-3">{s.service_name}</h3>
            <p className="text-gray-300">{s.service_category}</p>
            <p className="font-semibold mt-2">
              Tk {s.cost} / {s.unit}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditingService(s)}
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Update
              </button>

              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* UPDATE MODAL */}
      {editingService && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 w-full max-w-xl p-6 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">Update Service</h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                className="w-full p-3 bg-gray-700 rounded-lg"
                value={editingService.service_name}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    service_name: e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="w-full p-3 bg-gray-700 rounded-lg"
                value={editingService.cost}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    cost: Number(e.target.value),
                  })
                }
              />

              <input
                type="text"
                className="w-full p-3 bg-gray-700 rounded-lg"
                value={editingService.service_category}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    service_category: e.target.value,
                  })
                }
              />

              <textarea
                className="w-full p-3 bg-gray-700 rounded-lg"
                rows="4"
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    description: e.target.value,
                  })
                }
              />

              <input
                type="text"
                className="w-full p-3 bg-gray-700 rounded-lg"
                value={editingService.image}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    image: e.target.value,
                  })
                }
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="bg-gray-600 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageDecorator;
