import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  submitFeedback,
  listFeedback,
} from "../contollers/feedback.controller.js";

const r = Router();

// User can submit feedback if enrolled
r.post("/", requireAuth, submitFeedback);

// Admin can view all feedbacks
r.get("/", requireAuth, requireAdmin, listFeedback);

export default r;
