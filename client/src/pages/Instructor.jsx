import React, { useEffect, useState } from "react";
import axios from "axios";

const Instructors = ({ user }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editInstructor, setEditInstructor] = useState(null);
  const [newName, setNewName] = useState("");

  const currentUser = user || JSON.parse(localStorage.getItem("user")) || null;

  const fetchInstructors = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/instructors"
      );
      setInstructors(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching instructors", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this instructor?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/instructors/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInstructors(instructors.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Error deleting instructor", err);
    }
  };

  const openEditModal = (instructor) => {
    setEditInstructor(instructor);
    setNewName(instructor.name || "");
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!newName) return alert("Name cannot be empty");
    try {
      await axios.put(
        `http://localhost:8080/api/v1/instructors/${editInstructor._id}`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchInstructors();
      setShowEditModal(false);
      setEditInstructor(null);
    } catch (err) {
      console.error("Error editing instructor", err);
    }
  };

  if (loading) return <p>Loading instructors...</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-[#B087CF] text-center">
        Instructors
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {instructors.length === 0 ? (
          <p>No instructors found.</p>
        ) : (
          instructors.map((ins) => (
            <div
              key={ins._id}
              className="relative rounded-2xl p-6 border shadow-md backdrop-blur-lg bg-white/30 hover:shadow-2xl hover:bg-white/40 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-30 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-xl font-bold text-gray-800">{ins.name}</h3>
                <span className="text-sm px-3 py-1 rounded-full bg-[#B087CF] text-white shadow">
                  Instructor
                </span>
              </div>

              <p className="text-gray-600 mb-3 relative z-10">{ins.email}</p>

              <div className="relative z-10">
                <p className="font-semibold text-gray-700">Courses:</p>
                <ul className="list-disc ml-6 text-gray-600 text-sm mt-1">
                  {ins.courses && ins.courses.length > 0 ? (
                    ins.courses.map((course) => (
                      <li key={course._id}>{course.title}</li>
                    ))
                  ) : (
                    <li>No courses assigned</li>
                  )}
                </ul>
              </div>

              {currentUser?.role === "admin" && (
                <div className="flex gap-3 mt-5 relative z-10">
                  <button
                    onClick={() => openEditModal(ins)}
                    className="flex-1 bg-[#B087CF] text-white px-4 py-2 rounded-lg hover:bg-[#9a6dc1] transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ins._id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Instructor</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full mb-4"
              placeholder="Instructor Name"
            />
            <button
              onClick={handleEditSubmit}
              className="bg-[#B087CF] text-white px-4 py-2 rounded-lg w-full hover:bg-[#9a6dc1] transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructors;
