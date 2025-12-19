import axios from "axios";

const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

apiConfig.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.href !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiConfig;
