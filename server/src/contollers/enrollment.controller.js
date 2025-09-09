import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

// Toggle enroll/unenroll
export const toggleEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (req.user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin cannot enroll in courses" });
    }

    const existing = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existing) {
      await Enrollment.findByIdAndDelete(existing._id);
      return res.status(200).json({ message: "Unenrolled successfully" });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });
    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    next(err);
  }
};

// Get user's enrollments
export const myEnrollments = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin has no personal enrollments" });
    }

    const list = await Enrollment.find({ user: req.user.id }).populate(
      "course"
    );

    // Filter out broken enrollments
    const safeList = list.filter((e) => e.course);
    res.json(safeList);
  } catch (e) {
    next(e);
  }
};

// Admin search enrollments by user email
export const adminSearchEnrollments = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.json([]);

    const list = await Enrollment.find({ user: user._id })
      .populate("course")
      .populate("user", "name email");

    const safeList = list.filter((e) => e.course && e.user);
    res.json(safeList);
  } catch (e) {
    next(e);
  }
};

// List all enrollments for admin
export const listAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title category");

    const safeEnrollments = enrollments.filter((e) => e.course && e.user);
    res.json(safeEnrollments);
  } catch (err) {
    next(err);
  }
};
