import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Search,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Pencil,
  Edit,
} from "lucide-react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const ManageDecorator = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [specialties, setSpecialties] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const axiosSecure = UseAxiosSecure();

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/users", {
        params: { search },
      });
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

  // Open modal
  const makeDecorator = (email) => {
    const user = users.find((u) => u.email === email);
    setSelectedUser(user);
    setSpecialties(user.specialties?.join(", ") || "");
    setIsModalOpen(true);
  };

  // Confirm make / update decorator
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

      toast.success(res.data.message || "Decorator updated");

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

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to promote user");
    }
  };

  // Toggle active
  const toggleActive = async (email) => {
    try {
      await axiosSecure.patch(`/admin/users/${email}/toggle-active`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle status");
    }
  };

  // 🔴 DELETE WITH TOAST CONFIRM
  const deleteDecorator = (email) => {
    toast(
      (t) => (
        <span className="flex flex-col gap-2">
          <b>Delete this decorator?</b>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-error text-white"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axiosSecure.delete(`/admin/decorators/${email}`);
                  toast.success("User deleted");

                  // Remove user from table
                  setUsers((prev) => prev.filter((u) => u.email !== email));
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete user");
                }
              }}
            >
              Delete
            </button>

            <button className="btn btn-sm" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 6000 }
    );
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-infinity loading-xl text-blue-500"></span>
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
                <th>Update/Delete</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={
                            user.photoURL || "https://i.ibb.co/4pB1q7q/user.png"
                          }
                          alt="user"
                        />
                      </div>
                    </div>
                  </td>

                  <td>{user.displayName || "N/A"}</td>
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
                    {user.specialties?.length > 0
                      ? user.specialties.join(", ")
                      : "-"}
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
                        className="btn btn-sm btn-primary-gradient rounded-2xl"
                      >
                        <UserPlus size={16} /> Decorator
                      </button>
                    ) : (
                      <span className="text-primary-gradient font-medium">
                        Decorator
                      </span>
                    )}
                  </td>

                  {/* ✅ MANAGE COLUMN */}
                  <td className="flex gap-2">
                    {user.role === "decorator" && (
                      <>
                        <button
                          onClick={() => makeDecorator(user.email)}
                          className="px-2 py-4 btn btn-xs bg-white/10 rounded-xl backdrop-blur-md border border-white/30 text-blue-400 hover:bg-white/20 hover:text-blue-300 transition-all duration-300"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteDecorator(user.email)}
                          className="px-2 py-4 btn btn-xs bg-red-600/20 rounded-xl backdrop-blur-md border border-red-400/50 text-red-400 hover:bg-red-600/40 hover:text-white transition-all duration-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
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
            <input
              className="input input-bordered w-full mt-4"
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
