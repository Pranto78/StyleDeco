// Hooks/UseAxiosSecure.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "https://server-deco.vercel.app",
});

// Hooks/UseAxiosSecure.js
axiosSecure.interceptors.request.use(async (config) => {
  // Only add admin token if we are actually logged in as admin
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    config.headers["x-admin-token"] = adminToken;
    // DO NOT return early — let Firebase token be added too if needed
  }

  const user = getAuth().currentUser;
  if (user) {
    try {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }

  return config;
});

export default () => axiosSecure;
