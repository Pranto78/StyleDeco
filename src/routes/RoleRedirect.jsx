import { Navigate } from "react-router-dom";
import UseAuthContext from "../Hooks/UseAuthContext";


const RoleRedirect = () => {
  const { role } = UseAuthContext();

  if (role === "admin") {
    return <Navigate to="manage-decorators" replace />;
  }

  if (role === "decorator") {
    return <Navigate to="assigned-projects" replace />;
  }

  return <Navigate to="profile" replace />;
};

export default RoleRedirect;
