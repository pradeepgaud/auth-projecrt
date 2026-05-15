import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

axios.defaults.withCredentials = true;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Store token in memory (not localStorage for security)
  // This persists across component re-renders within the session
  const tokenRef = useRef(null);

  // ── Set up axios interceptor to attach token to every request ──────────────
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      // If we have a token stored, send it as Authorization header
      // This works cross-origin even when cookies are blocked
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return config;
    });

    // Cleanup interceptor on unmount
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // ── Save token helper ──────────────────────────────────────────────────────
  const saveToken = (token) => {
    tokenRef.current = token;
    // Also save to sessionStorage so token survives page refresh
    if (token) {
      sessionStorage.setItem("authToken", token);
    } else {
      sessionStorage.removeItem("authToken");
    }
  };

  // ── Get token from sessionStorage on mount ─────────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem("authToken");
    if (stored) {
      tokenRef.current = stored;
    }
  }, []);

  // ── GET USER DATA ──────────────────────────────────────────────────────────
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      setUserData(null);
      console.error("getUserData error:", error.message);
    }
  };

  // ── CHECK AUTH ON PAGE LOAD/REFRESH ───────────────────────────────────────
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
        saveToken(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);
      // Don't clear token on network error, only on 401
      if (error.response?.status === 401) {
        saveToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    loading,
    saveToken, // expose so Login.jsx can call it after login
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
