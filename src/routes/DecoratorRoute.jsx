import { Navigate } from "react-router-dom";
import UseAuthContext from "../Hooks/UseAuthContext";
import UseDecorator from "../Hooks/UseDecorator";


const DecoratorRoute = ({ children }) => {
  const { user, loading } = UseAuthContext();
  const [isDecorator, decoLoading] = UseDecorator();

  if (loading || decoLoading) return <p>Loading...</p>;

  if (user && isDecorator) return children;

  return <Navigate to="/dashboard/assigned-projects" replace />;
};

export default DecoratorRoute;
