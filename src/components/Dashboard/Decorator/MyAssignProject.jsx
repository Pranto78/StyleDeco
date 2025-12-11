import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const MyAssignProject = () => {
  const axiosSecure = UseAxiosSecure();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Projects
  const loadProjects = async () => {
    try {
      const res = await axiosSecure.get("/decorator/projects");
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load & Auto-Refresh every 5 sec
  useEffect(() => {
    loadProjects();
    const interval = setInterval(loadProjects, 5000);
    return () => clearInterval(interval);
  }, []);

  // =====================
  // CENTERED LOADING
  // =====================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent bg-opacity-20">
        <span className="loading loading-infinity loading-xl text-6xl text-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 text-white min-h-screen bg-transparent">
      <h2 className="text-3xl font-bold mb-6 text-primary-gradient">
        My Assigned Projects
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects assigned yet.</p>
      ) : (
        <div className="bg-gray-900 p-5 rounded-xl shadow-xl overflow-x-auto">
          {/* DESKTOP TABLE */}
          <table className="w-full hidden md:table table-auto md:table-fixed">
            <thead className="bg-transparent text-blue-400">
              <tr>
                <th>#</th>
                <th>User Email</th>
                <th>Service</th>
                <th>Cost</th>
                <th>Booking Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p, i) => (
                <tr
                  key={p._id}
                  className="bg-transparent border-b border-gray-800"
                >
                  <td>{i + 1}</td>
                  <td>{p.userEmail}</td>
                  <td className="text-blue-400">{p.serviceName}</td>
                  <td className="text-green-400">৳{p.cost}</td>
                  <td>{new Date(p.bookedAt).toLocaleString()}</td>
                  <td className="font-bold text-yellow-400">
                    {p.projectStatus || "Assigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MOBILE VIEW */}
          <div className="md:hidden space-y-4">
            {projects.map((p, i) => (
              <div
                key={p._id}
                className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700"
              >
                <p className="text-sm text-gray-400">Project #{i + 1}</p>

                <p className="mt-2">
                  <span className="font-semibold">User:</span> {p.userEmail}
                </p>

                <p>
                  <span className="font-semibold">Service:</span>{" "}
                  <span className="text-blue-400">{p.serviceName}</span>
                </p>

                <p>
                  <span className="font-semibold">Cost:</span>{" "}
                  <span className="text-green-400">৳{p.cost}</span>
                </p>

                <p>
                  <span className="font-semibold">Booked:</span>{" "}
                  {new Date(p.bookedAt).toLocaleString()}
                </p>

                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="font-bold text-yellow-400">
                    {p.projectStatus || "Assigned"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignProject;
