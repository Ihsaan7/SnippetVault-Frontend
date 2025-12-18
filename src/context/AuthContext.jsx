import { createContext, useContext, useEffect, useState } from "react";
import apiConfig from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const register = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.post("/auth/register", formData);
      if (response && response.data && response.data.data.user) {
        setUser(response.data.data.user);
        setIsVerified(true);
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
      if (response && response.data && response.data.data.user) {
        setUser(response.data.data.user);
        setIsVerified(true);
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
      const response = await apiConfig.post("/logout");
      setUser(null);
      setIsVerified(false);
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
