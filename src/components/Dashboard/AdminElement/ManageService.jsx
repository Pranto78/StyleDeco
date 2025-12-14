import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import ServiceCard from "./ServiceCard";

const ManageService = () => {
  const [serviceData, setServiceData] = useState({
    service_name: "",
    cost: "",
    unit: "per event",
    service_category: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  const adminEmail = localStorage.getItem("adminEmail");

  const handleChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://server-deco.vercel.app/services");
      setServices(res.data);
    } catch (err) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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

      const res = await axios.post(
        "https://server-deco.vercel.app/services",
        payload,
        {
          headers: {
            "x-admin-token": localStorage.getItem("adminToken"),
          },
        }
      );

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
        fetchServices();
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to create service");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-transparent">
      {/* ----------------- CREATE NEW SERVICE SECTION ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto bg-transparent backdrop-blur-lg border 
        border-white/30 shadow-xl p-8 rounded-2xl mb-16"
      >
        <h2 className="text-3xl font-bold text-primary-gradient mb-6 text-center">
          Create New Service
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Service Name */}
          <div className="col-span-2">
            <label className="text-gray-200 font-medium">Service Name</label>
            <input
              type="text"
              name="service_name"
              value={serviceData.service_name}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 outline-none
                         shadow-inner focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              placeholder="Royal Wedding Stage Decoration"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="text-gray-200 font-medium">Cost (Tk)</label>
            <input
              type="number"
              name="cost"
              value={serviceData.cost}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 outline-none
                         shadow-inner focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              placeholder="50000"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="text-gray-200 font-medium">Unit</label>
            <select
              name="unit"
              value={serviceData.unit}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-white
               placeholder-gray-400 outline-none shadow-inner 
               focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
               transition-all duration-300"
            >
              <option className="bg-gray-800 text-white" value="per event">
                Per Event
              </option>
              <option className="bg-gray-800 text-white" value="per hour">
                Per Hour
              </option>
              <option className="bg-gray-800 text-white" value="daily">
                Daily
              </option>
            </select>
          </div>

          {/* Service Category */}
          <div className="col-span-2">
            <label className="text-gray-200 font-medium">
              Service Category
            </label>
            <input
              type="text"
              name="service_category"
              value={serviceData.service_category}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 outline-none
                         shadow-inner focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              placeholder="Wedding / Birthday / Corporate"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="text-gray-200 font-medium">Description</label>
            <textarea
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 outline-none
                         shadow-inner focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              placeholder="A luxurious golden-themed stage setup..."
            ></textarea>
          </div>

          {/* Image URL */}
          <div className="col-span-2">
            <label className="text-gray-200 font-medium">Image URL</label>
            <input
              type="text"
              name="image"
              value={serviceData.image}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 outline-none
                         shadow-inner focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              placeholder="https://ibb.co.com/example"
            />
          </div>

          {/* Image Preview */}
          {serviceData.image && (
            <div className="col-span-2 flex justify-center">
              <img
                src={serviceData.image}
                className="w-64 h-40 object-cover rounded-2xl shadow-lg mt-2 border border-white/30
                           transition-transform duration-300 hover:scale-105"
                alt="preview"
              />
            </div>
          )}

          {/* Create Button */}
          <div className="col-span-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.7)",
              }}
              className="w-full btn-primary-gradient text-white py-3 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300"
              type="submit"
            >
              Create Service
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* ----------------- ALL SERVICES SECTION ---------------- */}
      <h2 className="text-3xl font-bold text-primary-gradient text-center mb-6">
        All Services
      </h2>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-transparent bg-opacity-20">
          <span className="loading loading-infinity loading-xl text-6xl text-blue-500"></span>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center text-gray-300 text-xl">
          No services yet. Create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <AnimatePresence>
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onUpdate={fetchServices}
                onDelete={fetchServices}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageService;
