import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    }, 
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // if (!this.modifiedPaths("password")) return next();
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 11);
  next();
});
// for login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
