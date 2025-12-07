import React from "react";

// import { Navigate, useLocation } from "react-router";
// import Loading from "../components/Loading/Loading";
import UseAuthContext from "../Hooks/UseAuthContext";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = UseAuthContext();
  const location = useLocation();

  if (loading) {
    return "Loading........";
  }

  if (!user) {
    return <Navigate state={location.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoute;
