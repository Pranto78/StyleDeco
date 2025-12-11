import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";

const UpdateProjectStatus = () => {
  const axiosSecure = UseAxiosSecure();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state added

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
    try {
      const res = await axiosSecure.get("/decorator/projects");
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false); // ✅ stop loading
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/decorator/update-status/${id}`, {
        projectStatus: newStatus,
      });

      toast.success("Status updated!");

      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, projectStatus: newStatus } : p))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-transparent text-white">
      {/* PAGE TITLE */}
      <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent tracking-wide">
        Update Project Status
      </h2>

      {/* ======================= */}
      {/*      LOADING SCREEN     */}
      {/* ======================= */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          />
        </div>
      )}

      {/* ======================= */}
      {/*    MAIN CONTENT UI      */}
      {/* ======================= */}
      {!loading && (
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((p) => (
            <motion.div
              key={p._id}
              className="bg-[#0d1224] p-6 rounded-2xl shadow-xl border border-blue-600/30 
                         flex flex-col justify-between"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 15px 35px rgba(59, 130, 246, 0.45)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* PROJECT INFO */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-primary-gradient mb-2">
                  {p.serviceName}
                </h3>

                <p className="text-gray-300">
                  <span className="font-semibold text-blue-400">Client:</span>{" "}
                  {p.userEmail}
                </p>

                <p className="text-gray-300 mt-1">
                  <span className="font-semibold text-blue-400">Status:</span>{" "}
                  <span className="font-bold text-blue-300">
                    {p.projectStatus || "Assigned"}
                  </span>
                </p>
              </div>

              {/* STATUS DROPDOWN */}
              <motion.div
                className="mt-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <select
                  className="w-full p-3 bg-[#131a2c] text-white rounded-xl 
                             border border-blue-700 focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 transition"
                  onChange={(e) => updateStatus(p._id, e.target.value)}
                  value={p.projectStatus || "Assigned"}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="text-black">
                      {s}
                    </option>
                  ))}
                </select>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateProjectStatus;
