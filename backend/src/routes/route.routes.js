// backend/src/routes/route.routes.js
import express from "express";
import { 
  createRoute, 
  getUserRoutes, 
  getRouteById,
  updateRoute,
  deleteRoute 
} from "../controllers/routes.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Route endpoints
router.post("/", createRoute);
router.get("/", getUserRoutes);
router.get("/:id", getRouteById);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;