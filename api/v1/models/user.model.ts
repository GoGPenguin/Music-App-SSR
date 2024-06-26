import mongoose from "mongoose";
import { generateRandomNumber } from "../../../helper/generate";

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dgmzxojxe/image/upload/v1718808546/gszwrscyp1tfry8i5uxf.jpg",
    },
    token: {
      type: String,
      default: generateRandomNumber(30),
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
