// backend/src/controllers/report.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import Routes from "../models/Routes.model.js";
import Reports from "../models/Reports.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { generateRoutePDF } from "../services/pdfGenerator.service.js";
import { uploadPDFOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";

// Generate report from a route
export const generateReport = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { routeId } = req.params;
  const { fuelPricePerLiter = 100 } = req.body; // Default ₹100/L

  // Fetch route data
  const route = await Routes.findOne({ _id: routeId, userId });

  if (!route) {
    throw new ApiError(404, "Route not found");
  }

  // Calculate report data
  const fuelUsed = route.fuelRequired || 0;
  const fuelCost = (fuelUsed * fuelPricePerLiter).toFixed(2);
  const avgMileage = fuelUsed > 0 ? (route.distance / fuelUsed).toFixed(2) : 0;

  const reportData = {
    source: route.source,
    destination: route.destination,
    distance: route.distance,
    duration: route.duration || 0,
    fuelUsed: fuelUsed,
    fuelCost: parseFloat(fuelCost),
    avgMileage: parseFloat(avgMileage)
  };

  console.log("📊 Generating PDF for report data:", reportData);

  // Generate PDF
  const pdfPath = await generateRoutePDF(reportData);
  console.log("✅ PDF generated at:", pdfPath);

  // Upload to Cloudinary
  const cloudinaryResponse = await uploadPDFOnCloudinary(pdfPath);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Failed to upload PDF to cloud");
  }

  console.log("☁️ Uploaded to Cloudinary:", cloudinaryResponse.secure_url);

  // Create report in database
  const report = await Reports.create({
    userId,
    routeId,
    source: route.source,
    destination: route.destination,
    distance: route.distance,
    duration: route.duration,
    fuelUsed: fuelUsed,
    fuelCost: parseFloat(fuelCost),
    avgMileage: parseFloat(avgMileage),
    pdfUrl: cloudinaryResponse.secure_url,
    cloudinaryPublicId: cloudinaryResponse.public_id,
    reportName: `${route.source}_to_${route.destination}_${Date.now()}`
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, report, "Report generated successfully")
    );
});

// Get all reports for a user
export const getUserReports = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const reports = await Reports.find({ userId })
    .sort({ createdAt: -1 })
    .populate('routeId', 'source destination');

  return res
    .status(200)
    .json(
      new ApiResponse(200, reports, "Reports fetched successfully")
    );
});

// Get a single report by ID
export const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const report = await Reports.findOne({ _id: id, userId })
    .populate('routeId');

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, report, "Report fetched successfully")
    );
});

// Delete a report
export const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const report = await Reports.findOne({ _id: id, userId });

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  // Delete from Cloudinary if exists
  if (report.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(report.cloudinaryPublicId);
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
    }
  }

  await Reports.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Report deleted successfully")
    );
});

// Download report PDF
export const downloadReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const report = await Reports.findOne({ _id: id, userId });

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  if (!report.pdfUrl) {
    throw new ApiError(404, "PDF not available for this report");
  }

  try {
    // Fetch PDF from Cloudinary
    const response = await fetch(report.pdfUrl);
    
    if (!response.ok) {
      throw new Error("Failed to fetch PDF from cloud storage");
    }

    const buffer = await response.arrayBuffer();
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.source}_to_${report.destination}_report.pdf"`);
    res.setHeader('Content-Length', buffer.byteLength);
    
    // Send PDF
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new ApiError(500, "Failed to download PDF");
  }
});