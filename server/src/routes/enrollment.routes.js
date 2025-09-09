// enrollment.routes.js
import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  toggleEnrollment,
  myEnrollments,
  adminSearchEnrollments,
  listAllEnrollments, // import the new controller
} from "../contollers/enrollment.controller.js";

const r = Router();

// Toggle enroll/un-enroll
r.post("/", requireAuth, toggleEnrollment);

// Get current user's enrolled courses
r.get("/me", requireAuth, myEnrollments);

// Admin search by email
r.get("/admin/search", requireAuth, requireAdmin, adminSearchEnrollments);

// Admin get all enrollments
r.get("/", requireAuth, requireAdmin, listAllEnrollments); // NEW

export default r;
