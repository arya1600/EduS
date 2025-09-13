import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// Route imports
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import supportRoutes from "./routes/support.routes.js";

import { errorHandler, notFound } from "./middleware/error.js";

dotenv.config();
const app = express();
// Default Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/instructors", instructorRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/support", supportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
