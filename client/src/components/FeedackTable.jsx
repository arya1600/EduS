import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
      } catch (err) {
        console.error(
          "Error fetching feedbacks:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [token]);

  if (loading)
    return (
      <p className="p-6 text-gray-500 text-center">Loading feedbacks...</p>
    );

  if (feedbacks.length === 0)
    return (
      <p className="p-6 text-gray-500 text-center">No feedbacks available.</p>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#B087CF] text-center">
        All Feedbacks
      </h2>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-inner bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-100 text-left text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {feedbacks.map((fb, idx) => (
              <tr
                key={fb._id}
                className={`hover:bg-purple-50 transition-colors ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {fb.user?.name || fb.user?.email || "Unknown"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {fb.course?.title || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {fb.message || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(fb.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-4">
        {feedbacks.map((fb) => (
          <div key={fb._id} className="bg-white shadow-md rounded-xl p-4">
            <p className="text-sm text-gray-500">User</p>
            <p className="font-medium text-gray-800">
              {fb.user?.name || fb.user?.email || "Unknown"}
            </p>

            <p className="text-sm text-gray-500 mt-2">Course</p>
            <p className="font-medium text-gray-800">
              {fb.course?.title || "N/A"}
            </p>

            <p className="text-sm text-gray-500 mt-2">Message</p>
            <p className="font-medium text-gray-800">{fb.message || "-"}</p>

            <p className="text-sm text-gray-500 mt-2">Created At</p>
            <p className="font-medium text-gray-800">
              {new Date(fb.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackTable;
