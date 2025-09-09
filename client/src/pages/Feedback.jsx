import React, { useEffect, useState } from "react";
import axios from "axios";
import FeedbackTable from "../components/FeedackTable";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");

  // User-side state
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseMessage, setCourseMessage] = useState({});
  const [courseRating, setCourseRating] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);

    if (user?.role === "admin") {
      fetchAllFeedbacks();
    } else if (user?.role === "user") {
      fetchEnrolledCourses();
    }
  }, []);

  // ================= Admin Functions =================
  const fetchAllFeedbacks = async () => {
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
      console.error("Error fetching feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  const totalFeedbacks = feedbacks.length;
  const avgRating =
    feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
    (feedbacks.length || 1);

  const ratingsPerCourse = feedbacks.reduce((acc, f) => {
    const course = f.course?.title || "Unknown";
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {});

  // ================= User Functions =================
  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/enrollments/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolledCourses(data.map((e) => e.course));
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
    }
  };

  const handleSubmitFeedback = async (courseId) => {
    try {
      const message = courseMessage[courseId] || "";
      const rating = Number(courseRating[courseId]) || 0;

      await axios.post(
        "http://localhost:8080/api/v1/feedback",
        { courseId, message, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Feedback submitted!");
      fetchEnrolledCourses();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Error submitting feedback");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading feedbacks...</p>;

  // ================= Admin View =================
  if (currentUser?.role === "admin") {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#B087CF]">
          Feedback Analytics
        </h2>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Feedbacks
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {totalFeedbacks}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Average Rating
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-500">
              {avgRating.toFixed(1)} ⭐
            </p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Feedbacks per Course
            </h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {Object.entries(ratingsPerCourse).map(([course, count]) => (
                <li key={course}>
                  {course}: {count}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback Table */}
        <FeedbackTable />
      </div>
    );
  }

  // ================= User View =================
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-[#B087CF] text-center">
        My Enrolled Courses
      </h2>

      {enrolledCourses.length === 0 && (
        <p className="text-gray-500">You are not enrolled in any courses.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl shadow-lg border p-5 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Current Rating: ⭐ {course.rating.toFixed(1)}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                min="0"
                max="5"
                placeholder="0-5"
                className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-center text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={courseRating[course._id] || ""}
                onChange={(e) =>
                  setCourseRating({
                    ...courseRating,
                    [course._id]: e.target.value,
                  })
                }
              />
              <span className="text-sm text-gray-500">Stars</span>
            </div>

            <textarea
              placeholder="Write your feedback..."
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-green-400 focus:outline-none mb-3"
              rows={3}
              value={courseMessage[course._id] || ""}
              onChange={(e) =>
                setCourseMessage({
                  ...courseMessage,
                  [course._id]: e.target.value,
                })
              }
            />

            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium"
              onClick={() => handleSubmitFeedback(course._id)}
            >
              Submit Feedback
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
