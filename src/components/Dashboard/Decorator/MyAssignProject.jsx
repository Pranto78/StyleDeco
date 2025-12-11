import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const MyAssignProject = () => {
  const axiosSecure = UseAxiosSecure();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axiosSecure.get("/decorator/projects");
        setProjects(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">My Assigned Projects</h2>

      {projects.length === 0 ? (
        <p>No projects assigned yet.</p>
      ) : (
        <div className="bg-gray-900 p-5 rounded-xl">
          <table className="table w-full">
            <thead className="bg-gray-800">
              <tr>
                <th>#</th>
                <th>User Email</th>
                <th>Service</th>
                <th>Cost</th>
                <th>Booking Date</th>
                <th>Project Status</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p, i) => (
                <tr key={p._id} className="bg-gray-700">
                  <td>{i + 1}</td>
                  <td>{p.userEmail}</td>
                  <td className="text-purple-400">{p.serviceName}</td>
                  <td className="text-green-400">৳{p.cost}</td>
                  <td>{new Date(p.bookedAt).toLocaleString()}</td>

                  {/* NEW STATUS COLUMN */}
                  <td className="font-bold text-yellow-400">
                    {p.projectStatus || "Assigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAssignProject;
