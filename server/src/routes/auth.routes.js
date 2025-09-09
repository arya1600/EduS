import { Router } from "express";
import { body } from "express-validator";
import { signup, login } from "../contollers/auth.controller.js";

const r = Router();

r.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  signup
);
r.post("/login", login);

export default r;
