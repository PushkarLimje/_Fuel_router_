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

// export const downloadReport = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id;

//   const report = await Reports.findOne({ _id: id, userId });

//   if (!report) {
//     throw new ApiError(404, "Report not found");
//   }

//   if (!report.pdfUrl) {
//     throw new ApiError(404, "PDF not available for this report");
//   }

//   try {
//     console.log("📥 Fetching PDF from:", report.pdfUrl);

//     // Add fl_attachment flag to Cloudinary URL to force download
//     const downloadUrl = report.pdfUrl.replace(
//       '/upload/',
//       `/upload/fl_attachment:${report.source}_to_${report.destination}_report.pdf/`
//     );

//     console.log("📥 Download URL:", downloadUrl);

//     // Fetch PDF from Cloudinary using axios
//     const response = await axios.get(downloadUrl, {
//       responseType: 'arraybuffer',
//       timeout: 30000 // 30 second timeout
//     });

//     console.log("✅ PDF fetched successfully, size:", response.data.byteLength);

//     // Set headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${report.source}_to_${report.destination}_report.pdf"`);
//     res.setHeader('Content-Length', response.data.byteLength);
    
//     // Send PDF buffer
//     return res.send(Buffer.from(response.data));
    
//   } catch (error) {
//     console.error("❌ Error downloading PDF:", error.message);
//     console.error("❌ Full error:", error.response?.data || error);
//     throw new ApiError(500, "Failed to download PDF");
//   }
// });



// Download report PDF - Simple redirect (bypasses CORS)
// export const downloadReport = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id;

//   const report = await Reports.findOne({ _id: id, userId });

//   if (!report) {
//     throw new ApiError(404, "Report not found");
//   }

//   if (!report.pdfUrl) {
//     throw new ApiError(404, "PDF not available for this report");
//   }

//   try {
//     console.log("📥 Original Cloudinary URL:", report.pdfUrl);

//     // Add fl_attachment flag to force download instead of preview
//     let downloadUrl = report.pdfUrl.replace(
//       '/upload/',
//       `/upload/fl_attachment:${report.source}_to_${report.destination}_report.pdf/`
//     );

//     // For raw resources, Cloudinary URL structure is different
//     // If URL contains '/raw/upload/', adjust the flag position
//     if (report.pdfUrl.includes('/raw/upload/')) {
//       downloadUrl = report.pdfUrl.replace(
//         '/raw/upload/',
//         `/raw/upload/fl_attachment:${report.source}_to_${report.destination}_report.pdf/`
//       );
//     }

//     console.log("📥 Download URL with attachment flag:", downloadUrl);

//     // Redirect browser directly to Cloudinary (no CORS issues)
//     return res.redirect(302, downloadUrl);

//   } catch (error) {
//     console.error("❌ Error generating download URL:", error);
//     throw new ApiError(500, "Failed to download PDF");
//   }
// });

// Download report PDF - Redirect to Cloudinary with download flag

// Download report PDF - With detailed logging
// export const downloadReport = asyncHandler(async (req, res) => {
//   console.log("🚀 Download request started");
//   console.log("📋 Params:", req.params);
//   console.log("👤 User:", req.user?._id);

//   const { id } = req.params;
//   const userId = req.user._id;

//   console.log("🔍 Looking for report:", id, "for user:", userId);

//   const report = await Reports.findOne({ _id: id, userId });

//   if (!report) {
//     console.log("❌ Report not found");
//     throw new ApiError(404, "Report not found");
//   }

//   console.log("✅ Report found:", report._id);
//   console.log("📄 PDF URL:", report.pdfUrl);

//   if (!report.pdfUrl) {
//     console.log("❌ No PDF URL in report");
//     throw new ApiError(404, "PDF not available for this report");
//   }

//   try {
//     console.log("📥 Starting PDF fetch from Cloudinary...");
//     console.log("🔗 URL:", report.pdfUrl);

//     // Fetch PDF from Cloudinary
//     const response = await axios({
//       method: 'GET',
//       url: report.pdfUrl,
//       responseType: 'arraybuffer',
//       timeout: 30000,
//       validateStatus: function (status) {
//         return status < 500; // Don't throw on 4xx errors
//       }
//     });

//     console.log("📊 Response status:", response.status);
//     console.log("📊 Response headers:", response.headers);
//     console.log("📊 Data length:", response.data?.length || 0);

//     if (response.status !== 200) {
//       console.error("❌ Cloudinary returned non-200 status:", response.status);
//       throw new Error(`Cloudinary returned status ${response.status}`);
//     }

//     if (!response.data || response.data.length === 0) {
//       console.error("❌ Empty response from Cloudinary");
//       throw new Error("Empty PDF file");
//     }

//     console.log("✅ PDF fetched successfully, size:", response.data.length, "bytes");

//     // Create safe filename
//     const filename = `${report.source}_to_${report.destination}_report.pdf`
//       .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

//     console.log("📝 Setting filename:", filename);

//     // Set headers
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Length', response.data.length);
//     res.setHeader('Cache-Control', 'no-cache');

//     console.log("✅ Sending PDF to client...");

//     // Send PDF
//     res.end(Buffer.from(response.data));

//     console.log("✅ Download complete");

//   } catch (error) {
//     console.error("❌ Download error:");
//     console.error("❌ Message:", error.message);
//     console.error("❌ Stack:", error.stack);
//     console.error("❌ Response data:", error.response?.data);
//     console.error("❌ Response status:", error.response?.status);
    
//     throw new ApiError(500, `Failed to download PDF: ${error.message}`);
//   }
// });

// Download report PDF - Simple test version
// Download report PDF
export const downloadReport = asyncHandler(async (req, res) => {
  console.log("==========================================");
  console.log("🚀 DOWNLOAD REQUEST RECEIVED");
  console.log("Report ID:", req.params.id);
  console.log("User ID:", req.user?._id);
  console.log("==========================================");

  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("📋 Finding report...");
    const report = await Reports.findOne({ _id: id, userId });

    if (!report) {
      console.log("❌ Report not found");
      throw new ApiError(404, "Report not found");
    }

    console.log("✅ Report found:", report._id);
    console.log("📄 PDF URL:", report.pdfUrl);

    if (!report.pdfUrl) {
      console.log("❌ No PDF URL in report");
      throw new ApiError(404, "PDF not available for this report");
    }

    console.log("📥 Fetching PDF from Cloudinary...");
    console.log("🔗 URL:", report.pdfUrl);

    const response = await axios({
      method: 'GET',
      url: report.pdfUrl,
      responseType: 'arraybuffer',
      timeout: 30000,
      validateStatus: (status) => status < 500
    });

    console.log("📊 Response Status:", response.status);
    console.log("📊 Content-Type:", response.headers['content-type']);
    console.log("📊 Data Length:", response.data?.length || 0);

    if (response.status !== 200) {
      console.error("❌ Non-200 status from Cloudinary");
      throw new Error(`Cloudinary returned status ${response.status}`);
    }

    if (!response.data || response.data.length === 0) {
      console.error("❌ Empty response from Cloudinary");
      throw new Error("Empty PDF data received");
    }

    console.log("✅ PDF fetched successfully!");

    const filename = `${report.source}_to_${report.destination}_report.pdf`
      .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    console.log("📝 Filename:", filename);
    console.log("📤 Setting headers and sending...");

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', response.data.length);
    res.setHeader('Cache-Control', 'no-cache');

    res.end(Buffer.from(response.data));

    console.log("✅ Download complete!");
    console.log("==========================================");

  } catch (error) {
    console.error("==========================================");
    console.error("❌ DOWNLOAD ERROR:");
    console.error("Type:", error.constructor.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    
    console.error("==========================================");
    
    throw new ApiError(500, `Failed to download PDF: ${error.message}`);
  }
});