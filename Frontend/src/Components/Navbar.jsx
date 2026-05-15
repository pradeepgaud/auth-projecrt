import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext, { setAuthToken } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`);
    } catch (_) {
      // ignore logout API errors — clear state anyway
    }
    // ✅ Always clear token and state regardless of API response
    setAuthToken(null);
    setIsLoggedin(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 left-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
          {userData.name[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm rounded shadow-md min-w-[120px]">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer rounded whitespace-nowrap"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer rounded whitespace-nowrap"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
