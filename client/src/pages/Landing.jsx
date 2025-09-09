import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white space-y-6">
        <h1 className="text-5xl font-bold">Welcome to EduSphere</h1>
        <p className="text-lg">Your personal Learning Management System</p>
        <div className="space-x-4">
          <a
            href="/login"
            className="px-6 py-2 bg-white text-blue-600 rounded-lg shadow hover:bg-gray-100"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-6 py-2 bg-white text-purple-600 rounded-lg shadow hover:bg-gray-100"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
