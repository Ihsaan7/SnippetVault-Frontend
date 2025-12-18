import axios from "axios";

const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

export default apiConfig;
