import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Mongo Error:", err.message);
    process.exit(1);
  }
};
