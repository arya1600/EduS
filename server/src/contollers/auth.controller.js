import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
//dotenv configured
dotenv.config();

const sign = (payload) =>
  // Sign with 7 days expiry
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    //destructuring the body

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
      //if password doesn't meet regex criteria
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
    //password123 -> cahirufbagefhie3643749v8cqiuhcf

    const user = await User.create({ name, email, passwordHash, role: "user" });
    // 6. Sign JWT and respond

    const token = sign({ id: user._id, role: user.role, email: user.email });
    //payload is the object with id, role and email, this payload is sent to sign function.
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
    //destructuring the body,fetching email and password

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
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doest not exist" });
    // 2. Check password
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    // 3. Sign JWT and respond
    //if everything is okay
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
    //stores in local storage on client side
  } catch (e) {
    next(e);
  }
};
