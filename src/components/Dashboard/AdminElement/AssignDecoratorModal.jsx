import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";

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
        toast.error("Failed to load decorators");
      }
    };

    fetchDecorators();
  }, [axiosSecure]);

  const handleAssign = async () => {
    if (!selectedDecorator) {
      toast.error("Select a decorator first!");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post("/admin/assign-decorator", {
        bookingId: booking._id,
        decoratorEmail: selectedDecorator,
      });

      toast.success(res.data.message || "Decorator assigned successfully");
      onAssign(selectedDecorator);
      onClose();
    } catch (err) {
      console.error("Assign decorator failed:", err);
      toast.error("Failed to assign decorator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-96 shadow-2xl animate-fadeIn">
        <h3 className="text-2xl font-bold mb-4 text-primary-gradient text-center">
          Assign Decorator
        </h3>
        <p className="mb-4 text-gray-300 text-center">
          Booking: <strong className="text-white">{booking.userEmail}</strong> -{" "}
          <span className="text-blue-400">{booking.serviceName}</span>
        </p>

        <ul className="mb-4 max-h-64 overflow-y-auto space-y-2">
          {decorators.map((dec) => (
            <li
              key={dec.email}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 transform 
                ${
                  selectedDecorator === dec.email
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 scale-105 shadow-lg"
                    : "bg-gray-800 hover:bg-gray-700 hover:scale-105"
                }`}
              onClick={() => setSelectedDecorator(dec.email)}
            >
              <div>
                <p className="text-white font-semibold">
                  {dec.displayName || dec.email}
                </p>
                <p className="text-gray-400 text-sm">
                  {dec.specialties.join(", ")}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={handleAssign}
          disabled={loading}
          className={`mt-2 w-full px-4 py-2 font-bold rounded-lg text-white text-lg transition-all duration-200 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:scale-105 shadow-md"
          }`}
        >
          {loading ? "Assigning..." : "Assign"}
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-200 shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AssignDecoratorModal;
