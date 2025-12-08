import UseAuthContext from "./UseAuthContext";
import { useQuery } from "@tanstack/react-query";

const UseAdmin = () => {
  const { user } = UseAuthContext();

  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ["isAdmin", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const adminEmail = localStorage.getItem("adminEmail");
      return !!adminEmail; // true if admin
    },
  });

  return [isAdmin, isLoading];
};

export default UseAdmin;
