import React, { useState } from "react";
import { motion } from "framer-motion";
import UseAuthContext from "../../../Hooks/UseAuthContext";
import toast from "react-hot-toast";

const MyProfle = () => {
  const { user, updateUserProfile } = UseAuthContext();

  const [name, setName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUserProfile({ displayName: name });

      toast.success("Profile updated successfully! 🎉");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto mt-10 p-8 bg-secondary-gradient shadow-xl rounded-2xl border border-gray-100"
    >
      {/* Title */}
      <motion.h2
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-center mb-6"
      >
        My Profile
      </motion.h2>

      {/* Profile Picture */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-6"
      >
        <img
          src={
            user?.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          className="w-24 h-24 rounded-full border-4 border-purple-200 shadow-md"
        />
      </motion.div>

      {/* Name */}
      <div className="mb-4">
        <label className="text-sm font-semibold">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
          placeholder="Enter your name"
        />
      </div>

      {/* Email (readonly) */}
      <div className="mb-6">
        <label className="text-sm font-semibold">Email</label>
        <input
          type="email"
          value={user?.email}
          readOnly
          className="w-full mt-1 px-4 py-2 border bg-gray-100 rounded-lg text-gray-600 cursor-not-allowed"
        />
      </div>

      {/* Update Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleUpdate}
        disabled={loading}
        className="w-full py-3 text-white rounded-xl shadow-md 
        btn-primary-gradient hover:btn-primary-gradient-hover 
        transition-all duration-300"
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-screen bg-transparent bg-opacity-20">
            <span className="loading loading-infinity loading-xl text-6xl text-blue-500"></span>
          </div>
        ) : (
          "Update Profile"
        )}
      </motion.button>
    </motion.div>
  );
};

export default MyProfle;
