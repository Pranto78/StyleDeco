import UseAuthContext from "./UseAuthContext";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "./UseAxiosSecure";

const UseDecorator = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuthContext();

  const { data: isDecorator = false, isLoading } = useQuery({
    queryKey: ["isDecorator", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/decorator/${user.email}`);
      return res.data?.decorator || false;
    },
  });

  return [isDecorator, isLoading];
};

export default UseDecorator;
