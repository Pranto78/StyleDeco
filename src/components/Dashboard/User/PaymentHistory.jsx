import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const PaymentHistory = () => {
  const axiosSecure = UseAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      const res = await axiosSecure.get("/payments");
      setPayments(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load payments");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const cancelPayment = async (id) => {
    try {
      await axiosSecure.patch(`/payments/${id}/cancel`);
      toast.success("Payment cancelled");
      loadPayments();
    } catch (error) {
      toast.error("Cancel failed");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-infinity loading-xl text-6xl text-blue-500"></span>
      </div>
    );

  return (
    <div className="p-4 sm:p-8 w-full max-w-6xl mx-auto text-white">
      <h2 className="text-3xl mb-6 text-primary-gradient font-bold">
        Payment History
      </h2>

      {/* Table for large screens */}
      <div className="hidden lg:block overflow-x-auto rounded-xl shadow-xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-transparent text-primary-gradient text-lg">
              <th>#</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Cancel</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id} className="bg-transparent">
                <td>{i + 1}</td>
                <td className="text-primary-gradient font-bold">
                  {p.serviceName}
                </td>
                <td className="text-green-400">৳{p.amount}</td>
                <td>{new Date(p.paidAt).toLocaleString()}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-lg ${
                      p.status === "paid" ? "bg-primary-gradient" : "bg-red-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td>
                  {p.status === "paid" ? (
                    <button
                      className="px-4 py-2 bg-red-600 rounded-lg"
                      onClick={() => cancelPayment(p._id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small/mobile screens */}
      <div className="lg:hidden space-y-4">
        {payments.map((p, i) => (
          <div key={p._id} className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-primary-gradient font-bold text-lg">
              {p.serviceName}
            </h3>
            <p className="text-green-400 font-semibold">Amount: ৳{p.amount}</p>
            <p>Date: {new Date(p.paidAt).toLocaleString()}</p>
            <p>
              Status:{" "}
              <span
                className={`px-2 py-1 rounded-lg ${
                  p.status === "paid" ? "bg-primary-gradient" : "bg-red-600"
                }`}
              >
                {p.status}
              </span>
            </p>
            {p.status === "paid" ? (
              <button
                className="mt-2 px-4 py-2 bg-red-600 rounded-lg"
                onClick={() => cancelPayment(p._id)}
              >
                Cancel
              </button>
            ) : (
              <span className="text-gray-400 mt-2 block">N/A</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
