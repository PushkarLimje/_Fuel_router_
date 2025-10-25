// // src/controllers/dashboard.controller.js
// import asyncHandler from "../utils/asyncHandler.js";
// import Routes from "../models/Routes.model.js";
import Reports from "../models/Reports.model.js";
// import RecentRoute from "../models/RecentRoute.model.js";
// import ApiResponse from "../utils/ApiResponse.js";

// backend/src/controllers/dashboard.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import Routes from "../models/Routes.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getFuelStationsByCoordinates } from "../services/fuelStations.service.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Get coordinates from query params (sent from frontend)
  const { lat, lon } = req.query;

  console.log("🔍 Fetching dashboard for userId:", userId);
  console.log("📍 User location:", lat, lon);

  // Count total routes
  const totalRoutes = await Routes.countDocuments({ userId });
  console.log("📊 Total routes:", totalRoutes);
 
  const totalReports = await Reports.countDocuments({ userId })
  console.log("📊 Total routes:", totalReports);

  // Get recent 5 routes from Routes model
  const recentRoutes = await Routes.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('source destination distance duration fuelRequired createdAt');

  console.log("📋 Recent routes:", recentRoutes.length);

  // Fetch nearby fuel stations if coordinates provided
  let totalFuelStations = 0;
  let locationInfo = "Location not available";

  if (lat && lon) {
    const fuelStationsData = await getFuelStationsByCoordinates(
      parseFloat(lat), 
      parseFloat(lon), 
      10 // 10km radius
    );
    totalFuelStations = fuelStationsData.count;
    locationInfo = fuelStationsData.locationName || "Your Location";
    console.log("⛽ Fuel stations found:", totalFuelStations);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        totalRoutes,
        totalReports ,
        totalFuelStations,
        recentRoutes,
        locationInfo
      }, "Dashboard data fetched successfully")
    );
});