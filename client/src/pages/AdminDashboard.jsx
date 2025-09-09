import React, { useState, useEffect } from "react";
import AddInstructor from "../components/AdminAddInstructor";
import AddCourse from "../components/AdminAddCourse";
import FeedbackTable from "../components/FeedackTable";
import EnrolledCoursesTable from "../components/EnrolledCoursesTable";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/v1/feedback",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFeedbacks(data);
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

  // Analytics
  const totalFeedbacks = feedbacks.length;
  const avgRating =
    feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
    (feedbacks.length || 1);

  const ratingsPerCourse = feedbacks.reduce((acc, f) => {
    const course = f.course?.title || "Unknown";
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(ratingsPerCourse).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#B087CF",
    "#6B46C1",
    "#ECC94B",
    "#48BB78",
    "#4299E1",
    "#F56565",
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#B087CF]">
        Admin Dashboard
      </h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          onClick={() => setShowInstructorModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Add Instructor
        </button>
        <button
          onClick={() => setShowCourseModal(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Add Course
        </button>
      </div>

      {/* Instructor Modal */}
      {showInstructorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowInstructorModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <AddInstructor />
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <AddCourse />
          </div>
        </div>
      )}

      {/* Analytics Cards */}
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Feedbacks */}
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Total Feedbacks</h3>
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-3xl font-bold">{totalFeedbacks}</p>
          <p className="text-sm opacity-80 mt-1">All user feedback submitted</p>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Average Rating</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
          <p className="text-sm opacity-80 mt-1">Based on user feedback</p>
        </div>

        {/* Feedbacks per Course (Pie Chart) */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Feedbacks per Course</h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="w-full h-40 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <div className="overflow-auto max-h-[400px] bg-white rounded-xl shadow-md p-4">
          <FeedbackTable />
        </div>

        <div className="overflow-auto max-h-[400px] bg-white rounded-xl shadow-md p-4">
          <EnrolledCoursesTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
