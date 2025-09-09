import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
dotenv.config();

const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Prevent signing up as admin
    if (email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({ message: "Cannot sign up as admin" });
    }

    // 2. Email must be Gmail for users
    if (!/@gmail\.com$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Only @gmail.com emails allowed" });
    }

    // 3. Password validation (min 6 chars, 1 uppercase, 1 number, 1 special char)
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special symbol.",
      });
    }

    // 4. Check duplicate
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    // 5. Hash and save
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: "user" });

    const token = sign({ id: user._id, role: user.role, email: user.email });
    res.status(201).json({
      token,
      user: { id: user._id, name, email, role: user.role },
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // hardcoded admin
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = sign({ id: "admin", role: "admin", email });
      return res.json({
        token,
        user: { id: "admin", name: "Admin", email, role: "admin" },
      });
    }

    // normal user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = sign({ id: user._id, role: user.role, email: user.email });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};
