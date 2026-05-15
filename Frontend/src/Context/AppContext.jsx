// import axios from "axios";
// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const AppContext = createContext();

// export const AppContextProvider = (props) => {
//   // axios.defaults.withCredentials = true
//   const backendUrl = import.meta.env.VITE_BACKEND_URL; // <-- No trailing slash
//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(false);

//   const getAuthState = async () => {
//     console.log("Backend URL:", backendUrl);
//     console.log(`${backendUrl}/api/auth/is-auth`);
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
//         withCredentials: true,
//       });

//       if (data.success) {
//         setIsLoggedin(true);
//         getUserData();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   const getUserData = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/data`, {
//         withCredentials: true,
//       });

//       if (data.success) {
//         setUserData(data.userData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   useEffect(() => {
//     getAuthState();
//   }, []);

//   const value = {
//     backendUrl,
//     isLoggedin,
//     setIsLoggedin,
//     userData,
//     setUserData,
//     getUserData,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };

// export default AppContext;

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= CHECK AUTH =================
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);

      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= GET USER =================
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      console.log(error.message);
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
