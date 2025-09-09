import Course from "../models/Course.js";
import Instructor from "../models/Instructor.js";

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized: Admins only" });
  }
  next();
};

// List all courses with search, filter, pagination
export const listCourses = async (req, res, next) => {
  try {
    const { q, category, minRating, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const [items, total] = await Promise.all([
      Course.find(filter)
        .populate("instructor", "name email")
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Course.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    next(e);
  }
};

// Top rated courses
export const topRated = async (req, res, next) => {
  try {
    const courses = await Course.find({ rating: { $gt: 4 } })
      .sort({ rating: -1 })
      .populate("instructor", "name email");
    res.json(courses);
  } catch (e) {
    next(e);
  }
};

// Create a new course + update instructor.courses
export const createCourse = [
  requireAdmin,
  async (req, res, next) => {
    try {
      const { title, description, category, image, instructor } = req.body;

      const newCourse = await Course.create({
        title,
        description,
        category,
        image,
        instructor,
      });

      // Push course into instructor.courses
      await Instructor.findByIdAndUpdate(instructor, {
        $push: { courses: newCourse._id },
      });

      res.status(201).json(newCourse);
    } catch (e) {
      next(e);
    }
  },
];

// Update course + sync instructor if changed
export const updateCourse = [
  requireAdmin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { instructor, ...updates } = req.body;

      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: "Course not found" });

      // If instructor changed → remove from old instructor and add to new one
      if (instructor && instructor !== course.instructor.toString()) {
        await Instructor.findByIdAndUpdate(course.instructor, {
          $pull: { courses: id },
        });
        await Instructor.findByIdAndUpdate(instructor, {
          $push: { courses: id },
        });
        course.instructor = instructor;
      }

      Object.assign(course, updates);
      const updated = await course.save();

      res.json(updated);
    } catch (e) {
      next(e);
    }
  },
];

// Delete course + remove from instructor.courses
export const deleteCourse = [
  requireAdmin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: "Course not found" });

      await Instructor.findByIdAndUpdate(course.instructor, {
        $pull: { courses: id },
      });

      await course.deleteOne();
      res.json({ message: "Course deleted successfully" });
    } catch (e) {
      next(e);
    }
  },
];
