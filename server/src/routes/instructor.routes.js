import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  listInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../contollers/instructor.controller.js";

const r = Router();

r.get("/", listInstructors);
r.post("/", requireAuth, requireAdmin, createInstructor);
r.put("/:id", requireAuth, requireAdmin, updateInstructor);
r.delete("/:id", requireAuth, requireAdmin, deleteInstructor);

export default r;
