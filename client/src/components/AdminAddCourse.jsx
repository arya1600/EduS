import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCourse = ({ onClose }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    rating: 0,
    image: "",
    videoUrl: "", // ✅ Added videoUrl
    instructor: "",
  });
  const [instructors, setInstructors] = useState([]);

  // Fetch instructors for select dropdown
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/instructors");
        setInstructors(res.data);
      } catch (err) {
        console.error("Error fetching instructors:", err);
      }
    };
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in as admin.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/v1/courses", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Course added successfully!");
      setForm({
        title: "",
        description: "",
        category: "",

        image: "",
        videoUrl: "", // reset
        instructor: "",
      });

      if (onClose) onClose(); // Close modal if provided
    } catch (err) {
      console.error("Error adding course:", err.response?.data || err.message);
      alert("Error adding course");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Course</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Course Image URL"
          value={form.image}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="videoUrl"
          placeholder="Course Video URL"
          value={form.videoUrl}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="technical">Technical</option>
          <option value="marketing">Marketing</option>
          <option value="design">Design</option>
          <option value="finance">Finance</option>
          <option value="other">Other</option>
        </select>
        <select
          name="instructor"
          value={form.instructor}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Instructor</option>
          {instructors.map((ins) => (
            <option key={ins._id} value={ins._id}>
              {ins.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
