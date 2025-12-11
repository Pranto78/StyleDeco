import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AssignDecoratorModal = ({ booking, onClose, onAssign }) => {
  const axiosSecure = UseAxiosSecure();
  const [decorators, setDecorators] = useState([]);
  const [selectedDecorator, setSelectedDecorator] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDecorators = async () => {
      try {
        const res = await axiosSecure.get("/admin/decorators");
        setDecorators(res.data);
      } catch (err) {
        console.error("Failed to fetch decorators:", err);
      }
    };

    fetchDecorators();
  }, [axiosSecure]);

  const handleAssign = async () => {
    if (!selectedDecorator) return alert("Select a decorator first!");

    setLoading(true);
    try {
      const res = await axiosSecure.post("/admin/assign-decorator", {
        bookingId: booking._id,
        decoratorEmail: selectedDecorator,
      });

      alert(res.data.message); // "Decorator assigned successfully"
      onAssign(selectedDecorator); // notify parent to update booking list
      onClose(); // close modal
    } catch (err) {
      console.error("Assign decorator failed:", err);
      alert("Failed to assign decorator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96">
        <h3 className="text-2xl font-bold mb-4">Assign Decorator</h3>
        <p className="mb-4">
          Booking: <strong>{booking.userEmail}</strong> - {booking.serviceName}
        </p>

        <ul className="mb-4 max-h-60 overflow-y-auto">
          {decorators.map((dec) => (
            <li
              key={dec.email}
              className={`flex justify-between items-center mb-2 p-2 rounded cursor-pointer
                ${
                  selectedDecorator === dec.email
                    ? "bg-purple-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              onClick={() => setSelectedDecorator(dec.email)}
            >
              <span>{dec.displayName || dec.email}</span>
              <span className="text-sm text-purple-300">
                {dec.specialties.join(", ")}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleAssign}
          disabled={loading}
          className={`mt-2 w-full px-4 py-2 text-white font-bold rounded ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {loading ? "Assigning..." : "Assign"}
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AssignDecoratorModal;
