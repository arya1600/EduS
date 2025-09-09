import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  createTicket,
  myTickets,
  adminListTickets,
  adminAnswerTicket,
} from "../contollers/support.controller.js";

const r = Router();
r.post("/", requireAuth, createTicket);
r.get("/me", requireAuth, myTickets);
r.get("/", requireAuth, requireAdmin, adminListTickets);
r.put("/:id/answer", requireAuth, requireAdmin, adminAnswerTicket);
export default r;
