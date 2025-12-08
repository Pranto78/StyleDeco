// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import UseAuthContext from "../Hooks/UseAuthContext";

const PrivateRoute = ({ children }) => {
  const { user, role, loading, adminEmail } = UseAuthContext();
  const location = useLocation();

  // Still loading → show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Logged in as normal Firebase user
  // OR
  // Logged in as custom admin (we stored adminEmail in localStorage + set role in context)
  const isAuthenticated = user || (adminEmail && role === "admin");

  if (!isAuthenticated) {
    // Redirect to login but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // All good → show the protected page (Dashboard)
  return children;
};

export default PrivateRoute;
