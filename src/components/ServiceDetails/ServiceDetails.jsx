import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
// import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import toast, { Toaster } from "react-hot-toast"; // import hot toast
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const ServiceDetails = () => {
  const { id } = useParams(); // Match the route param
  const axiosSecure = UseAxiosSecure();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/services/${id}`);
        setService(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load service:", err.response || err);
        setError("Failed to load service.");
        setLoading(false);
      }
    };
    fetchService();
  }, [id, axiosSecure]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const res = await axiosSecure.get(`/services/${id}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    fetchReviews();
  }, [id, axiosSecure]);

  // Handle booking
  const handleBooking = async () => {
    if (!service) return;
    try {
      const bookingData = {
        serviceId: service._id,
        serviceName: service.service_name,
        cost: service.cost,
        bookedAt: new Date().toISOString(),
      };

      await axiosSecure.post("/bookings", bookingData);

      toast.success(`Booking confirmed for: ${service.service_name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to book service. Try again!");
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!rating || !comment) return toast.error("Add rating & comment");

    try {
      await axiosSecure.post(`/services/${id}/review`, { rating, comment });

      setReviews([
        { rating, comment, userEmail: "You", createdAt: new Date() },
        ...reviews,
      ]);
      setRating(0);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-2xl text-gray-400">
        Loading service...
      </p>
    );

  if (error)
    return <p className="text-center mt-20 text-2xl text-red-400">{error}</p>;

  if (!service) return null;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      {/* hot toast container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-gray-900 text-white p-8 rounded-2xl shadow-2xl mt-10"
      >
        {/* Service Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="overflow-hidden rounded-xl mb-6"
        >
          <img
            src={service.image}
            alt={service.service_name}
            className="w-full h-96 object-cover"
          />
        </motion.div>

        {/* Service Info */}
        <h2 className="text-4xl font-bold mb-3">{service.service_name}</h2>
        <p className="text-xl text-purple-400 mb-4">
          {service.service_category}
        </p>
        <p className="text-gray-300 mb-6 leading-relaxed">
          {service.description}
        </p>
        <p className="text-2xl font-bold text-green-400 mb-8">
          ৳{service.cost.toLocaleString()}{" "}
          <span className="text-lg text-gray-400">{service.unit}</span>
        </p>

        {/* Booking Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBooking}
          className="w-full py-4 rounded-xl btn-primary-gradient text-white font-bold text-xl shadow-lg mb-8"
        >
          Book This Service
        </motion.button>

        {/* Review Section */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                onClick={() => setRating(i)}
                className={`text-4xl cursor-pointer transition ${
                  i <= rating ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 text-white mb-4"
            rows="4"
            placeholder="Share your experience..."
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReviewSubmit}
            className="w-1/2 py-4 rounded-xl btn-primary-gradient text-white font-bold text-xl shadow-lg"
          >
            Submit Review
          </motion.button>
        </div>

        {/* Reviews List */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 p-6 rounded-lg mb-4"
              >
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={
                        s <= r.rating ? "text-yellow-400" : "text-gray-600"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 mb-2">{r.comment}</p>
                <p className="text-sm text-gray-500">
                  {r.userEmail || "Anonymous"} •{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ServiceDetails;
