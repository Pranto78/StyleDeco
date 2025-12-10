// Hooks/UseAdmin.js
import { useQuery } from "@tanstack/react-query";

const UseAdmin = () => {
  const adminEmail = localStorage.getItem("adminEmail");

  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      return !!localStorage.getItem("adminEmail"); // Simple check
    },
    // Run always - no dependency on Firebase user
    enabled: true,
    staleTime: Infinity, // Never refetch
    cacheTime: Infinity,
  });

  return [isAdmin, isLoading];
};

export default UseAdmin;
