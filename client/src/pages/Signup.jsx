import React, { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.email.endsWith("@gmail.com")) {
      return setError("Only @gmail.com emails are allowed.");
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(form.password)) {
      return setError(
        "Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special symbol."
      );
    }

    try {
      await api.post("/auth/signup", form);
      alert("Signup successful, please login.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Sign Up
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        {/* Name Input */}
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
          <FiUser className="text-gray-400 mr-2" />
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        {/* Email Input */}
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
          <FiMail className="text-gray-400 mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
          <FiLock className="text-gray-400 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold tracking-wide shadow-md hover:opacity-90 transition"
        >
          CREATE ACCOUNT
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
