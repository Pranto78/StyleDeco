import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const PaymentSuccess = () => {
  const axiosSecure = UseAxiosSecure();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savePayment = async () => {
      try {
        const res = await axiosSecure.get(`/stripe-session/${sessionId}`);
        const data = res.data;

        if (data.status !== "paid") {
          toast.error("Payment not completed");
          return;
        }

        await axiosSecure.post("/payments", {
          bookId: data.bookId,
          senderEmail: data.senderEmail,
          amount: data.amount,
          serviceName: data.serviceName,
          transactionId: data.transactionId,
        });

        toast.success("Payment saved successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save payment");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) savePayment();
  }, [axiosSecure, sessionId]);
  if (loading)
    return (
      <p className="text-center text-gray-400 text-xl mt-12">Processing...</p>
    );

  return (
    <div className="text-center mt-20 text-white">
      <h1 className="text-4xl font-bold text-green-400">
        Payment Successful 🎉
      </h1>
      <p className="mt-4">Your payment has been recorded.</p>
    </div>
  );
};

export default PaymentSuccess;
