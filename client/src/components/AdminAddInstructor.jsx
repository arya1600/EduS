import React, { useState } from "react";
import axios from "axios";

const AddInstructor = () => {
  const [form, setForm] = useState({ name: "", email: "", bio: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in as admin.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/v1/instructors", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Instructor added successfully!");
      setForm({ name: "", email: "", bio: "" });
    } catch (err) {
      console.error(
        "Error adding instructor:",
        err.response?.data || err.message
      );
      alert("Error adding instructor");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Add Instructor</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="Instructor Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Add Instructor
        </button>
      </form>
    </div>
  );
};

export default AddInstructor;
