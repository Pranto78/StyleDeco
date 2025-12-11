import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, UserPlus, ToggleLeft, ToggleRight } from "lucide-react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const ManageDecorator = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [specialties, setSpecialties] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const axiosSecure = UseAxiosSecure(); // Axios instance

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/users", { params: { search } });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // Open modal to make user a decorator
  const makeDecorator = (email) => {
    const user = users.find((u) => u.email === email);
    setSelectedUser(user);
    setSpecialties(user.specialties?.join(", ") || "");
    setIsModalOpen(true);
  };

  // Confirm making decorator
  const confirmMakeDecorator = async () => {
    if (!specialties.trim()) {
      toast.error("Please add at least one specialty");
      return;
    }

    try {
      const res = await axiosSecure.patch(
        `/admin/users/${selectedUser.email}/make-decorator`,
        { specialties: specialties.split(",").map((s) => s.trim()) }
      );

      toast.success(
        res.data.message || `${selectedUser.email} is now a decorator`
      );

      // 1️⃣ Update local users state immediately
      setUsers((prev) =>
        prev.map((user) =>
          user.email === selectedUser.email
            ? {
                ...user,
                role: "decorator",
                specialties: specialties.split(",").map((s) => s.trim()),
                isActive: true,
              }
            : user
        )
      );

      // 2️⃣ Close modal
      setIsModalOpen(false);
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to promote user");
    }
  };


  // Toggle decorator active/inactive
  const toggleActive = async (email) => {
    try {
      await axiosSecure.patch(`/admin/users/${email}/toggle-active`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl text-primary-gradient font-bold mb-8 text-center p-4">
        Manage Decorators
      </h1>

      {/* Search */}
      <div className="flex gap-4 mb-6 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-transparent bg-opacity-20">
          <span className="loading loading-infinity loading-xl text-6xl text-blue-500"></span>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="table table-zebra w-full">
            <thead className="bg-base-300">
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Specialties</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover">
                    <td>
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img
                            src={
                              user.photoURL ||
                              "https://i.ibb.co/4pB1q7q/user.png"
                            }
                            alt="user"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{user.displayName || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "decorator"
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {user.specialties?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.specialties.map((s, i) => (
                            <span
                              key={i}
                              className="badge badge-sm badge-outline"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {user.role === "decorator" && (
                        <button
                          onClick={() => toggleActive(user.email)}
                          className="btn btn-xs"
                        >
                          {user.isActive ? (
                            <>
                              <ToggleRight className="text-success" /> Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="text-error" /> Inactive
                            </>
                          )}
                        </button>
                      )}
                    </td>
                    <td>
                      {user.role !== "decorator" ? (
                        <button
                          onClick={() => makeDecorator(user.email)}
                          className="btn btn-sm btn-primary-gradient flex items-center gap-1 rounded-2xl"
                        >
                          <UserPlus size={16} /> Decorator
                        </button>
                      ) : (
                        <span className="text-primary-gradient font-medium">
                          Decorator
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Make {selectedUser?.displayName} a Decorator
            </h3>
            <p className="py-4">Enter specialties (comma separated)</p>
            <input
              type="text"
              placeholder="home, wedding, office, birthday..."
              className="input input-bordered w-full"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
            />
            <div className="modal-action">
              <button
                onClick={confirmMakeDecorator}
                className="btn btn-primary-gradient"
              >
                Confirm
              </button>
              <button onClick={() => setIsModalOpen(false)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDecorator;
