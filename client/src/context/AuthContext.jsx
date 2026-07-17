import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Sync token to Axios headers and LocalStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, [token]);

  // Load current user details if token exists on app mount
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
        setUser(res.data);
      } catch (err) {
        console.error("Token load verification failed:", err.message);
        setToken("");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Register user
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed. Try again.",
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid email or password.",
      };
    }
  };

  // Logout user
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
