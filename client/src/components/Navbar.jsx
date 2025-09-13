import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileDropdown from "../pages/Profile"; // import component
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    window.location.href = "/login";
  };

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/top-rated", label: "Top Rated" },
    { path: "/instructors", label: "Instructors" },
    { path: "/enrolled", label: "Enrolled" },
    { path: "/feedback", label: "Feedback" },
    { path: "/support", label: "Helpdesk" },
  ];

  if (user?.role === "admin") navLinks.push({ path: "/admin", label: "Admin" });

  return (
    <nav className="bg-[#b087cf] text-white px-4 sm:px-6 py-4 shadow-md relative z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <img src={logo} alt="edusphere" className="h-8 w-auto" />
        </Link>

        {/* Right: Hamburger + Desktop Profile */}
        <div className="flex items-center gap-3">
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex gap-4 items-center ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-gray-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden sm:block">
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>

        {/* Desktop Links */}
      </div>

      {/* Mobile Slide-in Menu */}
      <div
        className={`sm:hidden fixed top-0 left-0 h-full w-64 bg-[#b087cf] shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col mt-20 px-6 gap-4">
          {/* ProfileDropdown at the top */}
          {user && <ProfileDropdown user={user} onLogout={handleLogout} />}

          {/* Other nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className="px-3 py-2 rounded hover:bg-white/20 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={closeMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
