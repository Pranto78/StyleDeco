import React, { useEffect, useState } from "react";
// import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const PaymentHistory = () => {
  const axiosSecure = UseAxiosSecure();
  const [payments, setPayments] = useState([]);

  const loadPayments = async () => {
    try {
      const res = await axiosSecure.get("/payments");
      setPayments(res.data);
    } catch (err) {
      toast.error("Failed to load payments");
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

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl mb-6 font-bold">Payment History</h2>

      <div className="overflow-x-auto rounded-xl shadow-xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-800 text-purple-300 text-lg">
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
              <tr key={p._id} className="bg-gray-900 hover:bg-gray-800">
                <td>{i + 1}</td>
                <td className="text-purple-400">{p.serviceName}</td>
                <td className="text-green-400">৳{p.amount}</td>
                <td>{new Date(p.paidAt).toLocaleString()}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-lg ${
                      p.status === "paid" ? "bg-green-600" : "bg-red-600"
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
    </div>
  );
};

export default PaymentHistory;
