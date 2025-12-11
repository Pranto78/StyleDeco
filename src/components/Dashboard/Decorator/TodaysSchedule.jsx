import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const TodaysSchedule = () => {
  const axiosSecure = UseAxiosSecure();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysProjects();
  }, []);

  const fetchTodaysProjects = async () => {
    try {
      const res = await axiosSecure.get("/decorator/projects");
      const today = dayjs().startOf("day");
      const todaysProjects = res.data.filter(
        (p) => p.bookedAt && dayjs(p.bookedAt).isSame(today, "day")
      );
      setProjects(todaysProjects);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch projects");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent bg-opacity-20">
        <span className="loading loading-infinity loading-xl text-6xl text-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-transparent text-white">
      <h2 className="text-4xl font-bold mb-12 text-center text-primary-gradient tracking-wide">
        Today's Schedule
      </h2>

      {projects.length === 0 ? (
        <p className="text-center text-gray-300 text-xl">
          No projects scheduled for today.
        </p>
      ) : (
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
                <p className="text-gray-400 mt-1 text-sm">
                  Scheduled At: {dayjs(p.bookedAt).format("HH:mm A")}
                </p>
              </div>

              <motion.div
                className="mt-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <select
                  className="w-full p-3 bg-[#221f36] text-white rounded-xl border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  onChange={async (e) => {
                    try {
                      await axiosSecure.patch(
                        `/decorator/update-status/${p._id}`,
                        { projectStatus: e.target.value }
                      );
                      toast.success("Status updated!");
                      setProjects((prev) =>
                        prev.map((proj) =>
                          proj._id === p._id
                            ? { ...proj, projectStatus: e.target.value }
                            : proj
                        )
                      );
                    } catch {
                      toast.error("Failed to update status");
                    }
                  }}
                  value={p.projectStatus || "Assigned"}
                >
                  {[
                    "Assigned",
                    "Planning",
                    "Materials Ready",
                    "On The Way",
                    "Setup",
                    "Completed",
                  ].map((status) => (
                    <option key={status} value={status}>
                      {status}
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

export default TodaysSchedule;
