import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
  //timestamps will create createdAt and updatedAt fields automatically
);

userSchema.methods.comparePassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

// Ensure exactly one admin; we’ll enforce via controller during sign-up/login.
export default mongoose.model("User", userSchema);
