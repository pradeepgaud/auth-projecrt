import React, { useContext } from "react";
import { assets } from "../assets/assets";
import AppContext from "../Context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center mt-24 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6 object-cover shadow-lg border border-gray-200"
      />

      {/* ✅ FIX: Show full name, not just first letter */}
      {/* userData.name is the full name e.g. "Rahul Sharma" */}
      <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-semibold mb-3">
        Hey {userData ? userData.name : "Developer"}!
        <img
          src={assets.hand_wave}
          alt=""
          className="w-6 sm:w-8 animate-bounce"
        />
      </h1>

      <h2 className="text-xl sm:text-3xl font-bold mb-4">
        Welcome to our App 🚀
      </h2>

      <p className="max-w-xl text-sm sm:text-lg text-gray-600 leading-relaxed mb-8">
        Let's start with a quick tour so you can understand everything and get
        up and running in no time!
      </p>

      <button className="px-8 py-3 bg-blue-600 text-white text-sm sm:text-base rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300">
        Get Started
      </button>
    </div>
  );
};

export default Header;
