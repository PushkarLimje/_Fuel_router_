import express, { Router } from "express";

import {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

//register
router.route("/register").post(
  upload.fields([{ name: "avatar",  maxCount: 1,},]),
  registerUser
);

//login
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logOutUser);
// ✅ handles POST /api/v1/users/register

router.route("/refresh-Token").post(refreshAccessToken);

export default router;
