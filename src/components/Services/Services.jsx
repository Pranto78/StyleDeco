import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
// import UseAxiosSecure from "../hooks/UseAxiosSecure"; // import your secure axios hook

const Services = () => {
  const [services, setServices] = useState([]);
  const axiosSecure = UseAxiosSecure(); // use secure axios instance

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosSecure.get("/services"); // automatic JWT attached
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err.response || err);
      }
    };

    fetchServices();
  }, [axiosSecure]);

  return (
    <div className="max-w-7xl mx-auto my-20 px-5">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl text-primary-gradient font-bold text-center mb-10"
      >
        All Services
      </motion.h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-secondary-gradient rounded-2xl shadow-lg p-5 hover:shadow-2xl duration-300"
          >
            {/* Image */}
            <div className="w-full h-56 overflow-hidden rounded-xl mb-4">
              <img
                src={service.image}
                alt={service.service_name}
                className="w-full h-full object-cover hover:scale-110 transition duration-700"
              />
            </div>

            <p className="text-sm text-blue-500 font-semibold">
              {service.service_category}
            </p>

            <h3 className="text-xl text-primary-gradient font-bold mt-1">
              {service.service_name}
            </h3>

            <p className="text-gray-500 font-bold text-sm mt-2 line-clamp-2">
              {service.description}
            </p>

            <p className="mt-3 text-lg font-bold text-primary-gradient">
              ৳ {service.cost}{" "}
              <span className="text-sm text-gray-500">{service.unit}</span>
            </p>

            <Link
              to={`/service-details/${service._id.toString()}`}
              className="btn mt-4 w-full btn-primary-gradient hover:btn-primary-gradient-hover text-white py-2 rounded-xl duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              View Details
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
