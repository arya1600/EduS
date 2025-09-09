import Instructor from "../models/Instructor.js";
import Course from "../models/Course.js";

// List all instructors + courses
export const listInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find().populate("courses");
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching instructors" });
  }
};

// Create instructor
export const createInstructor = async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (err) {
    res.status(400).json({ message: "Error creating instructor" });
  }
};

// Update instructor
export const updateInstructor = async (req, res) => {
  try {
    const updated = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).populate("courses");
    if (!updated)
      return res.status(404).json({ message: "Instructor not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating instructor" });
  }
};

// Delete instructor + cleanup course reference
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    // Remove instructor from courses
    await Course.updateMany(
      { instructor: instructor._id },
      { $unset: { instructor: "" } }
    );

    await Instructor.findByIdAndDelete(req.params.id);

    res.json({ message: "Instructor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting instructor" });
  }
};
