/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import apiConfig from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // start loading until we hydrate

  // Rehydrate auth state from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("sv_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsVerified(true);
      } catch {
        localStorage.removeItem("sv_user");
      }
    }

    // token used for Authorization header (deploy-safe)
    try {
      const token = localStorage.getItem("sv_access_token");
      if (token) {
        // keep isVerified true only if we also have a token
        setIsVerified(true);
      }
    } catch {
      // ignore
    }

    setIsLoading(false);
  }, []);

  const register = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.post("/auth/register", formData);

      // Backend returns { data: { user, accessToken, refreshToken } }
      // (Older builds returned { data: {...} }) so we support both.
      const data = response?.data?.data;
      const nextUser = data?.user || data;
      const accessToken = data?.accessToken;

      if (nextUser) {
        setUser(nextUser);
        setIsVerified(true);
        localStorage.setItem("sv_user", JSON.stringify(nextUser));
      }

      if (accessToken) {
        localStorage.setItem("sv_access_token", accessToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("FRONTEND_REGISTER!!!");
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.post("/auth/login", formData);
      const data = response?.data?.data;
      const nextUser = data?.user;
      const accessToken = data?.accessToken;

      if (nextUser) {
        setUser(nextUser);
        setIsVerified(true);
        localStorage.setItem("sv_user", JSON.stringify(nextUser));
      }

      if (accessToken) {
        localStorage.setItem("sv_access_token", accessToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
      console.error("FRONTEND_LOGIN!!!");
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiConfig.post("/auth/logout");
      setUser(null);
      setIsVerified(false);
      localStorage.removeItem("sv_user");
      localStorage.removeItem("sv_access_token");
    } catch (err) {
      setError(err.response?.data?.message || "Logout Failed");
      console.error("FRONTEND_LOGOUT!!!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isVerified,
        isLoading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
