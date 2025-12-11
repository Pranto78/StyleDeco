import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const FeaturedService = () => {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const axiosSecure = UseAxiosSecure();
  const containerRef = useRef(null);

  const cardsPerPageDesktop = 3; // 3 cards per page for desktop
  const cardsPerPageTablet = 2; // 2 cards per page for tablet
  const cardsPerPageMobile = 1; // 1 card per page for mobile

  const [cardsPerPage, setCardsPerPage] = useState(cardsPerPageDesktop);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosSecure.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err.response || err);
      }
    };
    fetchServices();

    // Responsive logic
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(cardsPerPageMobile);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(cardsPerPageTablet);
      } else {
        setCardsPerPage(cardsPerPageDesktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [axiosSecure]);

  const totalPages = Math.ceil(services.length / cardsPerPage);

  const goToPage = (pageIndex) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = (container.scrollWidth / totalPages) * pageIndex;
    container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    setCurrentPage(pageIndex);
  };

  return (
    <div className="max-w-7xl mx-auto my-20 px-5">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl text-primary-gradient font-bold text-center mb-10"
      >
        Featured Services
      </motion.h2>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="flex gap-8 overflow-x-hidden snap-x snap-mandatory scrollbar-none"
      >
        {services.map((service) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 w-[350px] sm:w-[45%] md:w-[30%] snap-start bg-secondary-gradient rounded-2xl shadow-lg p-5 hover:shadow-2xl duration-300"
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
              to={`/service-details/${service._id.toString()}`}
              className="btn mt-4 w-full btn-primary-gradient hover:btn-primary-gradient-hover text-white py-2 rounded-xl duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              View Details
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`w-4 h-4 rounded-full transition-colors ${
                currentPage === idx
                  ? "bg-primary-gradient"
                  : "bg-gray-400 hover:bg-primary"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedService;
