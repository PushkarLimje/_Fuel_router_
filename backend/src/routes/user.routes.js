import express, { Router } from "express";

import {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,           // ✅ Add this import
  updateAccountDetails,     // ✅ Add this import
  updateUserAvatar,         // ✅ Add this import
  deleteAccount            // ✅ Add this import
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

// ✅ NEW: Profile routes
router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/profile").patch(verifyJWT, updateAccountDetails);

// ✅ NEW: Avatar route
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// ✅ NEW: Delete account route
router.route("/account").delete(verifyJWT, deleteAccount);

export default router;
