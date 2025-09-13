import React, { useEffect, useState } from "react";
import axios from "axios";

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  // courses the user is enrolled in
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const currentUser = user || JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const categories = [
    "All",
    "Technical",
    "Design",
    "Finance",
    "Marketing",
    "Others",
  ];

  const normalizeCategory = (cat = "") =>
    cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/courses");
      setCourses(data.items || []);

      if (currentUser?.role !== "admin" && token) {
        const enrollRes = await axios.get(
          "http://localhost:8080/api/v1/enrollments/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEnrolledIds(enrollRes.data.map((e) => e.course._id));
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const handleEditClick = (course) => {
    setEditCourse(course);
    setNewTitle(course.title);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!newTitle.trim()) return;
    try {
      await axios.put(
        `http://localhost:8080/api/v1/courses/${editCourse._id}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
      setShowEditModal(false);
      setEditCourse(null);
    } catch (err) {
      console.error("Error editing course:", err);
    }
  };

  const handleDelete = (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    axios
      .delete(`http://localhost:8080/api/v1/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setCourses(courses.filter((c) => c._id !== courseId)))
      .catch((err) => console.error("Error deleting course:", err));
  };

  const handleEnroll = async (courseId) => {
    if (!token) return alert("Please login to enroll");

    try {
      await axios.post(
        "http://localhost:8080/api/v1/enrollments",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Enrolled successfully!");
      setEnrolledIds([...enrolledIds, courseId]);
    } catch (err) {
      console.error(
        "Error enrolling course:",
        err.response?.data || err.message
      );
      alert("Error enrolling course");
    }
  };

  if (loading)
    return <p className="text-center text-lg mt-10">Loading courses...</p>;

  const filteredCourses = courses.filter((course) => {
    const normalizedCategory = normalizeCategory(course.category);
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || normalizedCategory === selectedCategory)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#B087CF]">
        Courses Available
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg flex-1 shadow-sm focus:ring-2 focus:ring-blue-400 w-[70%]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="rounded-2xl bg-white/90 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {course.description}
            </p>

            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {normalizeCategory(course.category)}
              </p>
              <p>
                <span className="font-semibold">Instructor:</span>{" "}
                {course.instructor?.name || "Unknown"}
              </p>
            </div>

            {currentUser?.role === "admin" && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(course)}
                  className="flex-1 bg-yellow-400 text-white px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            )}

            {currentUser?.role === "user" &&
              !enrolledIds.includes(course._id) && (
                <button
                  onClick={() => handleEnroll(course._id)}
                  className="mt-4 w-full bg-[#B087CF] text-white px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[#2a1937] transition"
                >
                  Enroll
                </button>
              )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Course Title</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSaveEdit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition w-full"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
