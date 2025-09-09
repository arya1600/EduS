import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // profile icon

const ProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
  };

  return (
    <div className="relative inline-block text-left">
      {/* Profile Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <FaUserCircle className="text-3xl text-white hover:text-gray-600  cursor-pointer" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
          <div className="px-4 py-2 border-b">
            <p className="font-semibold  text-gray-500">
              {user?.name || "Guest"}
            </p>
            <p className="text-sm text-gray-500">{user?.email || ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
