// backend/src/controllers/routes.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import Routes from "../models/Routes.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Create a new route
export const createRoute = asyncHandler(async (req, res) => {
  const userId = req.user._id; // from auth middleware
  
  const { 
    source, 
    destination, 
    distance, 
    duration, 
    fuelRequired, 
    pathCoordinates 
  } = req.body;

  // Validation
  if (!source || !destination || !distance) {
    throw new ApiError(400, "Source, destination, and distance are required");
  }

  // Validate pathCoordinates if provided
  if (pathCoordinates && !Array.isArray(pathCoordinates)) {
    throw new ApiError(400, "pathCoordinates must be an array");
  }

  // Create new route
  const newRoute = await Routes.create({
    userId,
    source,
    destination,
    distance,
    duration: duration || 0,
    fuelRequired: fuelRequired || 0,
    pathCoordinates: pathCoordinates || []
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newRoute, "Route created successfully")
    );
});

// Get all routes for a user
export const getUserRoutes = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const routes = await Routes.find({ userId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, routes, "Routes fetched successfully")
    );
});

// Get a single route by ID
export const getRouteById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const route = await Routes.findOne({ _id: id, userId });

  if (!route) {
    throw new ApiError(404, "Route not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, route, "Route fetched successfully")
    );
});

// Update a route
export const updateRoute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  
  const route = await Routes.findOne({ _id: id, userId });

  if (!route) {
    throw new ApiError(404, "Route not found");
  }

  const updatedRoute = await Routes.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedRoute, "Route updated successfully")
    );
});

// Delete a route
export const deleteRoute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const route = await Routes.findOne({ _id: id, userId });

  if (!route) {
    throw new ApiError(404, "Route not found");
  }

  await Routes.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Route deleted successfully")
    );
});