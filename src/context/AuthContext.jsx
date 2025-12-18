import { createContext, useContext, useEffect, useState } from "react";
import apiConfig from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [erorr, setError] = useState(null);
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
      const response = await apiConfig("/auth/login", formData);
      if (response && response.data && response.data.data.user) {
        setUser(response.data.data.user);
        setIsVerified(true);
      }
    } catch (err) {
      setError(err.message?.data?.message || "Login Failed");
      console.error("FRONTEND_LOGIN!!!");
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };
};
