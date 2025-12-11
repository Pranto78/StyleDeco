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
      const res = await axios.get("http://localhost:3000/services");
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

      const res = await axios.post("http://localhost:3000/services", payload, {
        headers: {
          "x-admin-token": localStorage.getItem("adminToken"),
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
          <div className="col-span-2">
            <label className="text-white">Service Name</label>
            <input
              type="text"
              name="service_name"
              value={serviceData.service_name}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              placeholder-gray-300 outline-none"
              placeholder="Royal Wedding Stage Decoration"
            />
          </div>

          <div>
            <label className="text-white">Cost (Tk)</label>
            <input
              type="number"
              name="cost"
              value={serviceData.cost}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              placeholder-gray-300 outline-none"
              placeholder="50000"
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
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              placeholder-gray-300 outline-none"
              placeholder="Wedding / Birthday / Corporate"
            />
          </div>

          <div className="col-span-2">
            <label className="text-white">Description</label>
            <textarea
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              placeholder-gray-300 outline-none"
              placeholder="A luxurious golden-themed stage setup..."
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="text-white">Image URL</label>
            <input
              type="text"
              name="image"
              value={serviceData.image}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              placeholder-gray-300 outline-none"
              placeholder="https://ibb.co.com/example"
            />
          </div>

          {serviceData.image && (
            <div className="col-span-2 flex justify-center">
              <img
                src={serviceData.image}
                className="w-64 h-40 object-cover rounded-xl shadow-lg mt-2 
                border border-white/30"
                alt="preview"
              />
            </div>
          )}

          <div className="col-span-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
              }}
              className="w-full btn-primary-gradient text-white py-3 
             rounded-xl text-lg font-semibold shadow-lg"
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
        <div className="text-center text-white">Loading services...</div>
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
