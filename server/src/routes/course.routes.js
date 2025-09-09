import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  listCourses,
  topRated,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../contollers/course.controller.js";

const r = Router();

r.get("/", listCourses);
r.get("/top-rated", topRated);
r.post("/", requireAuth, requireAdmin, createCourse);
r.put("/:id", requireAuth, requireAdmin, updateCourse);
r.delete("/:id", requireAuth, requireAdmin, deleteCourse);
export default r;
