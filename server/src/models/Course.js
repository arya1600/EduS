import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["technical", "marketing", "design", "finance", "other"],
      required: true,
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    image: { type: String }, // course thumbnail/photo URL
    videoUrl: { type: String }, // course video URL
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
  },
  { timestamps: true }
);

// Full-text search index
courseSchema.index({ title: "text", description: "text" });

export default mongoose.model("Course", courseSchema);
