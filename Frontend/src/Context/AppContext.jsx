import axios from "axios";
import { createContext, useEffect, useState } from "react";

axios.defaults.withCredentials = true;

const AppContext = createContext();

// ── Token helpers — set once, every axios call gets it automatically ──────────
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    sessionStorage.setItem("authToken", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    sessionStorage.removeItem("authToken");
  }
};

// Restore token on page refresh
const savedToken = sessionStorage.getItem("authToken");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // const getUserData = async () => {
  //   try {
  //     const { data } = await axios.get(`${backendUrl}/api/user/data`);
  //     if (data.success) {
  //       setUserData(data.userData);
  //     } else {
  //       setUserData(null);
  //     }
  //   } catch (error) {
  //     setUserData(null);
  //     console.error("getUserData:", error.message);
  //   }
  // };

  // const getAuthState = async () => {
  //   try {
  //     const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
  //     if (data.success) {
  //       setIsLoggedin(true);
  //       await getUserData();
  //     } else {
  //       setIsLoggedin(false);
  //       setUserData(null);
  //       setAuthToken(null);
  //     }
  //   } catch (error) {
  //     setIsLoggedin(false);
  //     setUserData(null);
  //     if (error.response?.status === 401) setAuthToken(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        // ✅ Koi toast nahi yahan
      }
    } catch (error) {
      setUserData(null);
      // ✅ Sirf console, toast nahi
      console.error("getUserData:", error.message);
    }
  };

  const getAuthState = async () => {
    try {
      const savedToken = sessionStorage.getItem("authToken");
      if (savedToken) {
        setAuthToken(savedToken);
      }

      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        // ✅ Silently clear — koi toast nahi
        setIsLoggedin(false);
        setUserData(null);
        setAuthToken(null);
      }
    } catch (error) {
      // ✅ Silently handle — login page pe error toast nahi dikhana
      setIsLoggedin(false);
      setUserData(null);
      if (error.response?.status === 401) setAuthToken(null);
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
