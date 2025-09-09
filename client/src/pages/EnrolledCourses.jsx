import React, { useEffect, useState } from "react";
import axios from "axios";
import EnrolledCoursesTable from "../components/EnrolledCoursesTable"; // Admin table

const EnrolledPage = ({ user }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const currentUser = user || JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!token) return;

      try {
        let res;
        if (currentUser?.role === "admin") {
          // Admin: get all enrollments
          res = await axios.get("http://localhost:8080/api/v1/enrollments", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Regular user: get only their enrollments
          res = await axios.get("http://localhost:8080/api/v1/enrollments/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          res.data = res.data.map((e) => e.course);
        }

        setEnrolledCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching enrollments:",
          err.response?.data || err.message
        );
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [token, currentUser?.role]);

  // Un-enroll from a course (only for regular users)
  const handleUnenroll = async (courseId) => {
    if (!token) return alert("Please login to un-enroll");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/enrollments",
        { courseId }, // toggle endpoint
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnrolledCourses(enrolledCourses.filter((c) => c._id !== courseId));
      alert(res.data.message);
    } catch (err) {
      console.error("Error unenrolling:", err.response?.data || err.message);
      alert("Error unenrolling course");
    }
  };

  if (loading)
    return <p className="p-6 text-gray-500">Loading enrollments...</p>;

  if (!enrolledCourses.length)
    return (
      <p className="p-6 text-gray-500">
        {currentUser?.role === "admin"
          ? "No enrollments found."
          : "You are not enrolled in any courses."}
      </p>
    );

  // ================= Admin Analytics =================
  if (currentUser?.role === "admin") {
    const totalEnrollments = enrolledCourses.length;

    const enrollmentsPerCourse = enrolledCourses.reduce((acc, c) => {
      const title = c.title || "Unknown";
      acc[title] = (acc[title] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#B087CF]">
          Enrollment Analytics
        </h2>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Enrollments
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {totalEnrollments}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Enrollments per Course
            </h3>
            <ul className="text-sm text-gray-600 mt-2">
              {Object.entries(enrollmentsPerCourse).map(([course, count]) => (
                <li key={course}>
                  {course}: {count}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Admin Table */}
        <EnrolledCoursesTable enrollments={enrolledCourses} />
      </div>
    );
  }

  // ================= User Enrollment Cards =================
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-[#B087CF] text-center">
        My Enrollments
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course?._id}
            className="relative rounded-2xl p-6 border shadow-md backdrop-blur-lg bg-white/30 
                      hover:shadow-2xl hover:bg-white/40 transition-all duration-300"
          >
            {/* Glassmorphism Shine */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-30 pointer-events-none"></div>

            {/* Course Image */}
            <img
              src={course?.image || "https://via.placeholder.com/150"}
              alt={course?.title || "No Title"}
              className="w-full h-40 object-cover rounded-lg mb-3 relative z-10"
            />

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 relative z-10">
              {course?.title || "Unknown"}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-2 text-sm relative z-10">
              {course?.description || "No description"}
            </p>

            {/* Details */}
            <div className="text-sm text-gray-700 space-y-1 relative z-10">
              <p>
                <b>Category:</b> {course?.category || "N/A"}
              </p>
              <p>
                <b>Rating:</b> ⭐ {course?.rating ?? "N/A"}
              </p>
              <p>
                <b>Instructor:</b> {course?.instructor?.name || "Unknown"}
              </p>
            </div>

            {/* Unenroll button */}
            <button
              onClick={() => handleUnenroll(course?._id)}
              disabled={!course?._id}
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition relative z-10"
            >
              🗑️ Unenroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledPage;
