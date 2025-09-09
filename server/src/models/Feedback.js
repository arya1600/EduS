import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: { type: Number, min: 0, max: 5 }, // <-- add this
    message: { type: String }, // optional comment
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
