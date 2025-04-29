import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("csrftoken");
  if (token && config.headers) {
    config.headers["X-CSRFToken"] = token;
  }
  return config;
});

export default axiosInstance;
