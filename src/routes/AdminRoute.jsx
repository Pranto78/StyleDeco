import { Navigate } from "react-router-dom";
import UseAdmin from "../Hooks/UseAdmin";
import UseAuthContext from "../Hooks/UseAuthContext";


const AdminRoute = ({ children }) => {
  const { user, loading } = UseAuthContext();
  const [isAdmin, adminLoading] = UseAdmin();

  if (loading || adminLoading) return <p>Loading...</p>;

  if (user && isAdmin) return children;

  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
