import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

// Automatically attach token or admin header
axiosSecure.interceptors.request.use(async (config) => {
  const adminEmail = localStorage.getItem("adminEmail");

  // 1️⃣ If admin is logged in
  if (adminEmail) {
    config.headers["x-admin-email"] = adminEmail;
    return config;
  }

  // 2️⃣ Otherwise check Firebase login
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const UseAxiosSecure = () => axiosSecure;

export default UseAxiosSecure;
