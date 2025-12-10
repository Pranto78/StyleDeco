// Hooks/UseAxiosSecure.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

axiosSecure.interceptors.request.use(async (config) => {
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) {
    config.headers["x-admin-token"] = adminToken;
    return config;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.log("Firebase token error");
    }
  }

  return config;
});

export default () => axiosSecure;
