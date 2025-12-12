import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center p-6 sm:p-10 mt-10"
    >
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-blue-500/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_35px_rgba(37,99,235,0.25)]">
        {/* Header Section */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <Mail
            size={58}
            className="text-blue-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.7)]"
          />
        </motion.div>

        <h1 className="text-3xl sm:text-5xl text-center font-extrabold text-blue-400 drop-shadow-lg">
          Contact Us
        </h1>

        <p className="text-gray-300 text-center mt-3 max-w-2xl mx-auto leading-relaxed">
          Need help, have questions, or want to book a decoration package? Our
          support team is available 24/7 to assist you.
        </p>

        {/* Contact Info */}
        <div className="grid sm:grid-cols-3 gap-6 text-gray-300 mt-10">
          <div className="bg-white/5 p-5 rounded-xl border border-blue-400/20 text-center">
            <Phone className="mx-auto text-blue-300 mb-2" />
            <p className="font-medium">Phone</p>
            <p className="text-sm">+880 1234-567890</p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-blue-400/20 text-center">
            <Mail className="mx-auto text-blue-300 mb-2" />
            <p className="font-medium">Email</p>
            <p className="text-sm">support@styleddecor.com</p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-blue-400/20 text-center">
            <MapPin className="mx-auto text-blue-300 mb-2" />
            <p className="font-medium">Location</p>
            <p className="text-sm">Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="mt-12 space-y-6">
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              required
              className="peer w-full px-4 py-3 bg-white/10 border border-blue-400/20 rounded-xl text-gray-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition"
            />
            <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-300 peer-valid:top-[-10px] peer-valid:text-sm">
              Your Name
            </label>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              required
              className="peer w-full px-4 py-3 bg-white/10 border border-blue-400/20 rounded-xl text-gray-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition"
            />
            <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-300 peer-valid:top-[-10px] peer-valid:text-sm">
              Your Email
            </label>
          </div>

          {/* Message Input */}
          <div className="relative">
            <textarea
              rows="4"
              required
              className="peer w-full px-4 py-3 bg-white/10 border border-blue-400/20 rounded-xl text-gray-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition"
            ></textarea>

            <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-300 peer-valid:top-[-10px] peer-valid:text-sm">
              Message
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold btn-primary-gradient rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.5)] text-white transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;
