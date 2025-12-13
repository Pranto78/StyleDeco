import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

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
  // UPDATE PROJECT STATUS
  // =====================
  const handleStatusUpdate = async (id) => {
    try {
      await axiosSecure.patch(`/decorator/update-status/${id}`, {
        projectStatus: "Completed",
      });
      toast.success("Project updated");
      loadProjects();
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  // =====================
  // DELETE ASSIGNMENT
  // =====================
  const handleDelete = (id) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gray-900 text-white border border-gray-700 rounded-xl shadow-xl px-6 py-4`}
        >
          <p className="font-semibold mb-4">Remove this assigned project?</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axiosSecure.delete(`/decorator/projects/${id}`);
                  toast.success("Assignment removed");
                  setProjects((prev) => prev.filter((p) => p._id !== id));
                } catch (err) {
                  console.error(
                    "Delete error:",
                    err.response?.data || err.message
                  );
                  toast.error("Failed to delete assignment");
                }
              }}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };


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
                <th className="w-12 text-center">#</th>
                <th className="w-56">User Email</th>
                <th>Service</th>
                <th>Cost</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p, i) => (
                <tr
                  key={p._id}
                  className="bg-transparent border-b border-gray-800"
                >
                  <td className="w-12 text-center">{i + 1}</td>

                  <td className="w-56 truncate whitespace-nowrap overflow-hidden">
                    <span title={p.userEmail}>{p.userEmail}</span>
                  </td>
                  <td className="text-blue-400">{p.serviceName}</td>
                  <td className="text-green-400">৳{p.cost}</td>
                  <td>{new Date(p.bookedAt).toLocaleString()}</td>
                  <td className="font-bold text-yellow-400">
                    {p.projectStatus || "Assigned"}
                  </td>

                  {/* ACTIONS */}
                  <td className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(p._id)}
                      className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition"
                      title="Update Status"
                    >
                      <Pencil size={18} className="text-blue-400" />
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition"
                      title="Delete Assignment"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
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

                {/* MOBILE ACTIONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleStatusUpdate(p._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 py-2 rounded-lg"
                  >
                    <Pencil size={16} /> Update
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 py-2 rounded-lg"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignProject;
