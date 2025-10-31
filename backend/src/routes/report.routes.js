// // backend/src/routes/report.routes.js
// import express from "express";
// import { 
//   generateReport, 
//   getUserReports, 
//   getReportById,
//   deleteReport,
//   downloadReport
// } from "../controllers/report.controller.js";
// import { verifyJWT } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // All routes require authentication
// router.use(verifyJWT);

// // Generate report from a route
// router.post("/generate/:routeId", generateReport);

// // Get all user reports
// router.get("/", getUserReports);

// // Download report PDF (must be before /:id to avoid conflict)
// router.get("/download/:id", downloadReport);

// // Get single report
// router.get("/:id", getReportById);

// // Delete report
// router.delete("/:id", deleteReport);

// export default router;

// backend/src/routes/report.routes.js
import express from "express";
import { 
  generateReport, 
  getUserReports, 
  getReportById,
  deleteReport,
  downloadReport,
  fixExistingReports
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Generate report from a route
router.post("/generate/:routeId", generateReport);

// Get all user reports
router.get("/", getUserReports);

// ⚠️ CRITICAL: Download route MUST be before /:id
router.get("/download/:id", downloadReport);

// Delete report (also before /:id)
router.delete("/:id", deleteReport);

// Get single report (MUST be last)
router.get("/:id", getReportById);

// Add this route (temporary, can remove after fixing)
router.post("/fix-existing", fixExistingReports);

export default router;