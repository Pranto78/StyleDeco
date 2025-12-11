import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
      <span className="loading loading-infinity loading-xl text-blue-500"></span>
    </div>
  );
};

export default Loading;
