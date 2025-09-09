import React, { useEffect, useState } from "react";
import axios from "axios";

const EnrolledCoursesTable = () => {
  const [enrollments, setEnrollments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/v1/enrollments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEnrollments(data);
      } catch (err) {
        console.error(
          "Error fetching enrollments:",
          err.response?.data || err.message
        );
      }
    };
    fetchEnrollments();
  }, [token]);

  if (!enrollments.length)
    return (
      <p className="text-center mt-10 text-gray-600">No enrollments found.</p>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#B087CF] text-center">
        All Enrolled Courses
      </h2>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Course Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Date Enrolled
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.map((enroll, idx) => {
              const course = enroll.course || {};
              const student = enroll.user || {};
              return (
                <tr
                  key={enroll._id || idx}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {student.name || "Unknown"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {course.title || "Unknown"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {course.category || "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {enroll.createdAt
                      ? new Date(enroll.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-4">
        {enrollments.map((enroll, idx) => {
          const course = enroll.course || {};
          const student = enroll.user || {};
          return (
            <div
              key={enroll._id || idx}
              className="bg-white shadow-md rounded-xl p-4"
            >
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium text-gray-800">
                {student.name || "Unknown"}
              </p>

              <p className="text-sm text-gray-500 mt-2">Course</p>
              <p className="font-medium text-gray-800">
                {course.title || "Unknown"}
              </p>

              <p className="text-sm text-gray-500 mt-2">Category</p>
              <p className="font-medium text-gray-800">
                {course.category || "N/A"}
              </p>

              <p className="text-sm text-gray-500 mt-2">Date Enrolled</p>
              <p className="font-medium text-gray-800">
                {enroll.createdAt
                  ? new Date(enroll.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnrolledCoursesTable;
