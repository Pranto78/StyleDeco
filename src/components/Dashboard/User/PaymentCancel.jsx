import React from "react";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, Home, RefreshCcw } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white p-6">
      {/* ANIMATED ICON */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
      >
        <XCircle size={100} className="text-red-500 drop-shadow-lg" />
      </motion.div>

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mt-6"
      >
        Payment Canceled
      </motion.h1>

      {/* DESCRIPTION */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-300 mt-3 text-center max-w-md"
      >
        Your payment could not be completed. You can try again or explore other
        options below.
      </motion.p>

      {/* SWIPER OPTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md mt-10"
      >
        <Swiper spaceBetween={20} slidesPerView={1}>
          <SwiperSlide>
            <div className="p-6 bg-slate-800 rounded-2xl shadow-xl flex flex-col items-center">
              <RefreshCcw size={42} className="text-blue-400" />
              <h2 className="text-xl font-semibold mt-4">Try Again</h2>
              <p className="text-gray-400 mt-2 text-center">
                Something went wrong during the payment. Retry now.
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="p-6 bg-slate-800 rounded-2xl shadow-xl flex flex-col items-center">
              <Home size={42} className="text-green-400" />
              <h2 className="text-xl font-semibold mt-4">Back to Home</h2>
              <p className="text-gray-400 mt-2 text-center">
                Return to the homepage and continue browsing easily.
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="p-6 bg-slate-800 rounded-2xl shadow-xl flex flex-col items-center">
              <ArrowLeft size={42} className="text-yellow-400" />
              <h2 className="text-xl font-semibold mt-4">Go Back</h2>
              <p className="text-gray-400 mt-2 text-center">
                Return to the previous page and continue from where you left.
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
