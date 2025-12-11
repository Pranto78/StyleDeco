import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";

const UpdateProjectStatus = () => {
  const axiosSecure = UseAxiosSecure();
  const [projects, setProjects] = useState([]);

  const statuses = [
    "Assigned",
    "Planning",
    "Materials Ready",
    "On The Way",
    "Setup",
    "Completed",
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const res = await axiosSecure.get("/decorator/projects");
    setProjects(res.data);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/decorator/update-status/${id}`, {
        projectStatus: newStatus,
      });
      toast.success("Status updated!");
      // Update local state instead of reloading all projects
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, projectStatus: newStatus } : p))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-[#0d0b1f] to-[#1a0f3d] text-white">
      <h2 className="text-4xl font-bold mb-12 text-center text-purple-400 tracking-wide">
        Update Project Status
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {projects.map((p) => (
          <motion.div
            key={p._id}
            className="bg-[#181626] p-6 rounded-2xl shadow-xl border border-purple-800/30 flex flex-col justify-between"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 15px 35px rgba(139, 92, 246, 0.5)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* PROJECT INFO */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-purple-300 mb-2">
                {p.serviceName}
              </h3>
              <p className="text-gray-300">
                <span className="font-semibold text-pink-400">Client:</span>{" "}
                {p.userEmail}
              </p>
              <p className="text-gray-300 mt-1">
                <span className="font-semibold text-yellow-400">Status:</span>{" "}
                <span className="font-bold text-yellow-300">
                  {p.projectStatus || "Assigned"}
                </span>
              </p>
            </div>

            {/* DROPDOWN */}
            <motion.div
              className="mt-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <select
                className="w-full p-3 bg-[#221f36] text-white rounded-xl border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                onChange={(e) => updateStatus(p._id, e.target.value)}
                value={p.projectStatus || "Assigned"}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpdateProjectStatus;
