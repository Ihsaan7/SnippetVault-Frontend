import axios from "axios";

const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

apiConfig.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    // This is the endpoint being called (ex: "/auth/login")
    const requestUrl = error.config?.url || "";

    // 1) Don't redirect on login/register failures (otherwise your error flashes then page reloads)
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    if (status === 401 && !isAuthRequest) {
      // 2) Use pathname ("/login") instead of full href ("http://localhost:5173/login")
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"; // you can keep href; main fix is the conditions above
      }
    }

    return Promise.reject(error);
  }
);

export default apiConfig;
