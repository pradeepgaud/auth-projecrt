// import React, { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";
// import AppContext from "../Context/AppContext";

// import axios from "axios";
// import { toast } from "react-toastify";

// const EmailVerify = () => {
//   axios.defaults.withCredentials = true;
//   const { backendUrl, getUserData, isLoggedin, userData } =
//     useContext(AppContext);

//   const navigate = useNavigate();
//   const inputRefs = React.useRef([]);

//   // Move to next input
//   const handleInput = (e, index) => {
//     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   // Handle backspace
//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && e.target.value === "" && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   // Handle paste
//   const handlepaste = (e) => {
//     e.preventDefault();
//     const paste = e.clipboardData.getData("text").trim();
//     const pastArray = paste.split("");

//     pastArray.forEach((char, index) => {
//       if (inputRefs.current[index]) {
//         inputRefs.current[index].value = char;
//         if (inputRefs.current[index + 1]) {
//           inputRefs.current[index + 1].focus();
//         }
//       }
//     });
//   };

//   // Submit OTP
//   const onSumbitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const otpArray = inputRefs.current.map((e) => e.value);
//       const otp = otpArray.join("");

//       const { data } = await axios.post(
//         backendUrl + "/api/auth/verify-account",
//         { otp }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getUserData();
//         navigate("/");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   useEffect(() => {
//     isLoggedin && userData && userData.isAccountVerified && navigate("/");
//   }, [isLoggedin, userData]);

//   return (
//     <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
//       <img
//         onClick={() => navigate("/")}
//         src={assets.logo}
//         alt=""
//         className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
//       />

//       <form
//         onSubmit={onSumbitHandler}
//         className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
//       >
//         <h1 className="text-white text-2xl font-semibold text-center mb-4">
//           Email Verify OTP
//         </h1>

//         <p className="text-center mb-6 text-indigo-300">
//           Enter the 6 digit code sent to your email id.
//         </p>

//         <div className="flex justify-between mb-8" onPaste={handlepaste}>
//           {Array(6)
//             .fill(0)
//             .map((_, index) => (
//               <input
//                 type="text"
//                 maxLength="1"
//                 key={index}
//                 required
//                 className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 onInput={(e) => handleInput(e, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//               />
//             ))}
//         </div>

//         <button
//           type="submit"
//           className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full"
//         >
//           Verify email
//         </button>
//       </form>

//     </div>
//   );
// };

// export default EmailVerify;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const { backendUrl, getUserData, isLoggedin, userData } =
    useContext(AppContext);

  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const [loading, setLoading] = useState(false);

  // ── Redirect if already verified ─────────────────────────────────────────
  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData]);

  // ── Redirect if not logged in ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedin) {
      navigate("/login");
    }
  }, [isLoggedin]);

  // ── Move to next input ────────────────────────────────────────────────────
  const handleInput = (e, index) => {
    // Only allow digits
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);

    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ── Backspace go to prev input ────────────────────────────────────────────
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ── Paste handler ─────────────────────────────────────────────────────────
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .trim()
      .replace(/[^0-9]/g, "") // digits only
      .slice(0, 6);

    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  // ── Submit OTP ────────────────────────────────────────────────────────────
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    const otp = inputRefs.current.map((el) => el.value).join("");

    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
      );

      if (data.success) {
        toast.success(data.message);
        // ✅ FIX: await getUserData so navbar updates (Verify email hidden)
        // before navigating — without await, navbar still shows Verify email
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
        // Clear inputs on wrong OTP so user can retype
        inputRefs.current.forEach((el) => (el.value = ""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Verify Your Email
        </h1>

        {/* ✅ Show which email OTP was sent to */}
        <p className="text-center mb-1 text-indigo-300">
          Enter the 6-digit code sent to
        </p>
        <p className="text-center mb-6 text-white font-medium">
          {userData?.email || "your email"}
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="1"
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full font-medium disabled:opacity-70 transition-opacity"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <p
          onClick={() => navigate("/")}
          className="text-center text-gray-400 text-xs mt-4 cursor-pointer hover:text-gray-300"
        >
          Back to Home
        </p>
      </form>
    </div>
  );
};

export default EmailVerify;
