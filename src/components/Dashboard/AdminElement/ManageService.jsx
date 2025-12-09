import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";

const ManageService = () => {
  const [serviceData, setServiceData] = useState({
    service_name: "",
    cost: "",
    unit: "per event",
    service_category: "",
    description: "",
    image: "",
  });

  const adminEmail = localStorage.getItem("adminEmail");

  const handleChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !serviceData.service_name ||
      !serviceData.cost ||
      !serviceData.service_category ||
      !serviceData.description ||
      !serviceData.image
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const payload = {
        ...serviceData,
        cost: Number(serviceData.cost),
        createdByEmail: adminEmail,
      };

      const res = await axios.post("http://localhost:3000/services", payload, {
        headers: {
          "x-admin-token": localStorage.getItem("adminToken"), // 🔥 FIXED
        },
      });

      if (res.data.insertedId) {
        toast.success("Service Created Successfully!");
        setServiceData({
          service_name: "",
          cost: "",
          unit: "per event",
          service_category: "",
          description: "",
          image: "",
        });
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to create service");
    }
  };


  return (
    <div className="min-h-screen p-6 flex justify-center items-start bg-gradient-to-br from-gray-900 to-gray-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20
        shadow-xl p-8 rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create New Service
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-2">
            <label className="text-white">Service Name</label>
            <input
              type="text"
              name="service_name"
              value={serviceData.service_name}
              onChange={handleChange}
              placeholder="Royal Wedding Stage Decoration"
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            />
          </div>

          <div>
            <label className="text-white">Cost (Tk)</label>
            <input
              type="number"
              name="cost"
              value={serviceData.cost}
              onChange={handleChange}
              placeholder="50000"
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            />
          </div>

          <div>
            <label className="text-white">Unit</label>
            <select
              name="unit"
              value={serviceData.unit}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white outline-none"
            >
              <option value="per event">Per Event</option>
              <option value="per hour">Per Hour</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-white">Service Category</label>
            <input
              type="text"
              name="service_category"
              value={serviceData.service_category}
              onChange={handleChange}
              placeholder="Wedding / Birthday / Corporate"
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="text-white">Description</label>
            <textarea
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              rows="4"
              placeholder="A luxurious golden-themed stage setup..."
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="text-white">Image URL</label>
            <input
              type="text"
              name="image"
              value={serviceData.image}
              onChange={handleChange}
              placeholder="https://ibb.co.com/example"
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            />
          </div>

          {serviceData.image && (
            <div className="col-span-2 flex justify-center">
              <img
                src={serviceData.image}
                alt="Preview"
                className="w-64 h-40 object-cover rounded-xl shadow-lg mt-2 border border-white/30"
              />
            </div>
          )}

          <div className="col-span-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl
              text-lg font-semibold shadow-lg"
              type="submit"
            >
              Create Service
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ManageService;
