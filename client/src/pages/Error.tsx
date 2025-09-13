import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-purple-600">404</h1>
      <p className="mt-4 text-lg text-gray-700">Oops! Page not found.</p>
      <Link
        to="/home"
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Go Back Home
      </Link>
    </div>
  );
}
