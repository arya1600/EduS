import Feedback from "../models/Feedback.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// Submit feedback (only if enrolled)
export const submitFeedback = async (req, res, next) => {
  try {
    const { courseId, message, rating } = req.body;
    const userId = req.user.id;

    // Check if the user is enrolled in the course
    const enrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });
    if (!enrolled)
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });

    // Save feedback
    await Feedback.create({ user: userId, course: courseId, message, rating });

    // Update course average rating
    const feedbacks = await Feedback.find({ course: courseId });
    const avgRating =
      feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length;

    await Course.findByIdAndUpdate(courseId, { rating: avgRating });

    res.status(201).json({ message: "Feedback submitted", avgRating });
  } catch (e) {
    next(e);
  }
};

// List all feedbacks (admin only)
export const listFeedback = async (req, res, next) => {
  try {
    const list = await Feedback.find().populate("user course");
    res.json(list);
  } catch (e) {
    next(e);
  }
};
