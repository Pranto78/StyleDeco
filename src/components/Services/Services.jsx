import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosSecure.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [axiosSecure]);

  // Skeleton card (same layout & radius)
  const SkeletonCard = () => (
    <div className="bg-secondary-gradient rounded-2xl shadow-lg p-5 animate-pulse">
      <div className="w-full h-56 bg-gray-300/30 rounded-xl mb-4" />
      <div className="h-4 w-24 bg-gray-300/30 rounded mb-2" />
      <div className="h-5 w-3/4 bg-gray-300/30 rounded mb-3" />
      <div className="h-4 w-full bg-gray-300/30 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-300/30 rounded mb-4" />
      <div className="h-10 w-full bg-gray-300/30 rounded-xl" />
    </div>
  );

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : services.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-secondary-gradient rounded-2xl shadow-lg p-5 hover:shadow-2xl duration-300 flex flex-col h-full"
              >
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
                  to={`/service-details/${service._id}`}
                  className="btn mt-auto w-full btn-primary-gradient hover:btn-primary-gradient-hover text-white py-2 rounded-xl duration-300 transform hover:-translate-y-1 hover:shadow-lg"
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
