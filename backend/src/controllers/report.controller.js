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
import { User } from "../models/user.model.js";
import path from "path";

// Generate report from a route
// export const generateReport = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const { routeId } = req.params;
//   const { 
//     fuelPricePerLiter = 100,
//     fuelStation,
//     transaction,
//     quantity
//   } = req.body;

//   // Fetch route and user data
//   const route = await Routes.findOne({ _id: routeId, userId });
//   const user = await User.findById(userId);

//   if (!route) {
//     throw new ApiError(404, "Route not found");
//   }

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // ⭐ Calculate ALL costs FIRST before using them
//   const fuelUsed = quantity || route.fuelRequired || 0;
//   const fuelCost = (fuelUsed * fuelPricePerLiter).toFixed(2);
//   const totalCost = parseFloat(fuelCost); // ⭐ Define totalCost here
//   const gstAmount = (totalCost * 0.05).toFixed(2);
//   const grandTotal = (totalCost + parseFloat(gstAmount)).toFixed(2); // ⭐ Define grandTotal here
//   const avgMileage = fuelUsed > 0 ? (route.distance / fuelUsed).toFixed(2) : 0;
//   const co2SavedKg = (fuelUsed * 0.01).toFixed(2);

//   console.log("💰 Calculated values:");
//   console.log("  - Fuel Used:", fuelUsed);
//   console.log("  - Total Cost:", totalCost);
//   console.log("  - GST Amount:", gstAmount);
//   console.log("  - Grand Total:", grandTotal);

//   const reportData = {
//     source: route.source,
//     destination: route.destination,
//     distance: route.distance,
//     duration: route.duration || 0,
//     fuelUsed: fuelUsed,
//     fuelCost: parseFloat(fuelCost),
//     avgMileage: parseFloat(avgMileage),

//     // User vehicle info
//     userVehicle: user.vehicle || { number: 'N/A', fuelType: 'Petrol', avgMileage: 15 },
//     userName: `${user.firstName} ${user.lastName}`,
    
//     // Fuel station info
//     fuelStation: fuelStation || null,
    
//     // Transaction info - NOW totalCost and grandTotal are defined!
//     transaction: {
//       dateTime: new Date(),
//       fuelType: transaction?.fuelType || user.vehicle?.fuelType || 'Petrol',
//       pricePerUnit: fuelPricePerLiter,
//       quantity: fuelUsed,
//       totalCost: parseFloat(totalCost), // ✅ Now defined
//       paymentMode: transaction?.paymentMode || 'UPI',
//       paymentStatus: 'Paid',
//       gst: 5,
//       grandTotal: parseFloat(grandTotal) // ✅ Now defined
//     },
    
//     // Trip context
//     tripContext: {
//       tripId: route.tripId || `TRIP-${Date.now()}`,
//       routeType: route.routeType || 'Eco',
//       co2SavedKg: parseFloat(co2SavedKg)
//     },

//     // Receipt ID
//     receiptId: `RCPT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
//   };

//   console.log("📊 Generating PDF for report data:", reportData);

//   // Generate PDF
//   const pdfPath = await generateRoutePDF(reportData);
//   console.log("✅ PDF generated at:", pdfPath);

//   // Upload to Cloudinary
//   const cloudinaryResponse = await uploadPDFOnCloudinary(pdfPath);

//   if (!cloudinaryResponse) {
//     throw new ApiError(500, "Failed to upload PDF to cloud");
//   }

//   console.log("☁️ Uploaded to Cloudinary:", cloudinaryResponse.secure_url);

//   // Create report in database
//   const report = await Reports.create({
//     userId,
//     routeId,
//     source: route.source,
//     destination: route.destination,
//     distance: route.distance,
//     duration: route.duration,
//     fuelUsed: fuelUsed,
//     fuelCost: parseFloat(fuelCost),
//     avgMileage: parseFloat(avgMileage),

//     // NEW FIELDS:
//     fuelStation: fuelStation,
//     transaction: {
//       dateTime: new Date(),
//       fuelType: transaction?.fuelType || user.vehicle?.fuelType || 'Petrol',
//       pricePerUnit: fuelPricePerLiter,
//       quantity: fuelUsed,
//       totalCost: parseFloat(totalCost), // ✅ Now defined
//       paymentMode: transaction?.paymentMode || 'UPI',
//       paymentStatus: 'Paid',
//       gst: 5,
//       grandTotal: parseFloat(grandTotal) // ✅ Now defined
//     },
//     tripContext: {
//       routeType: route.routeType || 'Eco',
//       co2SavedKg: parseFloat(co2SavedKg)
//     },
//     system: {
//       apiSource: "TomTom Routing API",
//       device: req.headers['user-agent']?.includes('Mobile') ? 'Android' : 'Web',
//       verified: true
//     },

//     pdfUrl: cloudinaryResponse.secure_url,
//     cloudinaryPublicId: cloudinaryResponse.public_id,
//     reportName: `${route.source}_to_${route.destination}_${Date.now()}`
//   });

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(201, report, "Report generated successfully")
//     );
// });

// Generate report from a route
export const generateReport = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { routeId } = req.params;
  const { 
    fuelPricePerLiter = 100,
    fuelStation,
    transaction,
    quantity
  } = req.body;

  // Fetch route and user data
  const route = await Routes.findOne({ _id: routeId, userId });
  const user = await User.findById(userId);

  if (!route) {
    throw new ApiError(404, "Route not found");
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Calculate ALL costs FIRST
  const fuelUsed = quantity || route.fuelRequired || 0;
  const fuelCost = (fuelUsed * fuelPricePerLiter).toFixed(2);
  const totalCost = parseFloat(fuelCost);
  const gstAmount = (totalCost * 0.05).toFixed(2);
  const grandTotal = (totalCost + parseFloat(gstAmount)).toFixed(2);
  const avgMileage = fuelUsed > 0 ? (route.distance / fuelUsed).toFixed(2) : 0;
  const co2SavedKg = (fuelUsed * 0.01).toFixed(2);

  console.log("💰 Calculated values:");
  console.log("  - Fuel Used:", fuelUsed);
  console.log("  - Total Cost:", totalCost);
  console.log("  - Grand Total:", grandTotal);

  const reportData = {
    source: route.source,
    destination: route.destination,
    distance: route.distance,
    duration: route.duration || 0,
    fuelUsed: fuelUsed,
    fuelCost: parseFloat(fuelCost),
    avgMileage: parseFloat(avgMileage),
    userVehicle: user.vehicle || { number: 'N/A', fuelType: 'Petrol', avgMileage: 15 },
    userName: `${user.firstName} ${user.lastName}`,
    fuelStation: fuelStation || null,
    transaction: {
      dateTime: new Date(),
      fuelType: transaction?.fuelType || user.vehicle?.fuelType || 'Petrol',
      pricePerUnit: fuelPricePerLiter,
      quantity: fuelUsed,
      totalCost: parseFloat(totalCost),
      paymentMode: transaction?.paymentMode || 'UPI',
      paymentStatus: 'Paid',
      gst: 5,
      grandTotal: parseFloat(grandTotal)
    },
    tripContext: {
      tripId: route.tripId || `TRIP-${Date.now()}`,
      routeType: route.routeType || 'Eco',
      co2SavedKg: parseFloat(co2SavedKg)
    },
    receiptId: `RCPT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  };

  console.log("📊 Generating PDF for report data");

  // Generate PDF
  const pdfPath = await generateRoutePDF(reportData);
  console.log("✅ PDF generated at:", pdfPath);

  // ⭐ NEW: Store PDF locally instead of Cloudinary
  const publicPdfDir = path.join(process.cwd(), 'public', 'pdfs');
  
  // Ensure directory exists
  if (!fs.existsSync(publicPdfDir)) {
    fs.mkdirSync(publicPdfDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueFilename = `report_${Date.now()}_${userId}.pdf`;
  const publicPdfPath = path.join(publicPdfDir, uniqueFilename);

  // Copy PDF to public directory
  fs.copyFileSync(pdfPath, publicPdfPath);
  console.log("✅ PDF copied to public directory:", publicPdfPath);

  // Delete temp file
  if (fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
  }

  // Create PDF URL (served by backend)
  const pdfUrl = `/api/v1/reports/pdf/${uniqueFilename}`;

  console.log("📄 PDF URL:", pdfUrl);

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
    fuelStation: fuelStation,
    transaction: {
      dateTime: new Date(),
      fuelType: transaction?.fuelType || user.vehicle?.fuelType || 'Petrol',
      pricePerUnit: fuelPricePerLiter,
      quantity: fuelUsed,
      totalCost: parseFloat(totalCost),
      paymentMode: transaction?.paymentMode || 'UPI',
      paymentStatus: 'Paid',
      gst: 5,
      grandTotal: parseFloat(grandTotal)
    },
    tripContext: {
      routeType: route.routeType || 'Eco',
      co2SavedKg: parseFloat(co2SavedKg)
    },
    system: {
      apiSource: "TomTom Routing API",
      device: req.headers['user-agent']?.includes('Mobile') ? 'Android' : 'Web',
      verified: true
    },
    pdfUrl: pdfUrl, // ⭐ Store local URL instead of Cloudinary
    cloudinaryPublicId: uniqueFilename, // Store filename for easy access
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

  // ⭐ Delete local PDF file
  if (report.cloudinaryPublicId) {
    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', report.cloudinaryPublicId);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log("🗑️ Local PDF deleted");
    }
  }

  await Reports.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Report deleted successfully")
    );
});

// ⭐ TEMPORARY: Fix existing private PDFs
export const fixExistingReports = asyncHandler(async (req, res) => {
  try {
    console.log("🔧 Starting to fix existing reports...");
    
    const reports = await Reports.find({});
    console.log(`📋 Found ${reports.length} reports to fix`);
    
    let fixed = 0;
    let failed = 0;
    
    for (const report of reports) {
      if (report.cloudinaryPublicId) {
        try {
          // Update access mode to public
          await cloudinary.api.update(report.cloudinaryPublicId, {
            resource_type: 'image',
            access_mode: 'public'
          });
          
          console.log(`✅ Fixed: ${report.cloudinaryPublicId}`);
          fixed++;
        } catch (error) {
          console.error(`❌ Failed to fix: ${report.cloudinaryPublicId}`, error.message);
          failed++;
        }
      }
    }
    
    console.log(`\n✅ Fixed: ${fixed}`);
    console.log(`❌ Failed: ${failed}`);
    
    return res.status(200).json(
      new ApiResponse(200, { fixed, failed }, `Fixed ${fixed} reports, ${failed} failed`)
    );
  } catch (error) {
    console.error("❌ Error fixing reports:", error);
    throw new ApiError(500, "Failed to fix reports");
  }
});

// Download report PDF - Serve from local storage
export const downloadReport = asyncHandler(async (req, res) => {
  console.log("==========================================");
  console.log("🚀 DOWNLOAD REQUEST RECEIVED");
  console.log("Report ID:", req.params.id);
  console.log("User ID:", req.user?._id);
  console.log("==========================================");

  try {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Reports.findOne({ _id: id, userId });

    if (!report) {
      console.log("❌ Report not found");
      throw new ApiError(404, "Report not found");
    }

    console.log("✅ Report found:", report._id);
    console.log("📄 Filename:", report.cloudinaryPublicId);

    if (!report.cloudinaryPublicId) {
      console.log("❌ No PDF filename in report");
      throw new ApiError(404, "PDF not available for this report");
    }

    // Get PDF path
    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', report.cloudinaryPublicId);
    
    console.log("📁 PDF Path:", pdfPath);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      console.log("❌ PDF file not found on disk");
      throw new ApiError(404, "PDF file not found");
    }

    const filename = `${report.source}_to_${report.destination}_report.pdf`
      .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    console.log("📁 Download Filename:", filename);

    // Read and send file
    const fileBuffer = fs.readFileSync(pdfPath);
    
    console.log("✅ PDF read successfully, size:", fileBuffer.length);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');

    res.send(fileBuffer);

    console.log("✅ Download complete!");
    console.log("==========================================");

  } catch (error) {
    console.error("==========================================");
    console.error("❌ DOWNLOAD ERROR:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("==========================================");
    
    throw new ApiError(500, `Failed to download PDF: ${error.message}`);
  }
});

// // Download report PDF - Simple working version
// export const downloadReport = asyncHandler(async (req, res) => {
//   console.log("==========================================");
//   console.log("🚀 DOWNLOAD REQUEST RECEIVED");
//   console.log("Report ID:", req.params.id);
//   console.log("User ID:", req.user?._id);
//   console.log("==========================================");

//   try {
//     const { id } = req.params;
//     const userId = req.user._id;

//     console.log("📋 Finding report...");
//     const report = await Reports.findOne({ _id: id, userId });

//     if (!report) {
//       console.log("❌ Report not found");
//       throw new ApiError(404, "Report not found");
//     }

//     console.log("✅ Report found:", report._id);
//     console.log("📄 PDF URL:", report.pdfUrl);

//     if (!report.pdfUrl) {
//       console.log("❌ No PDF URL in report");
//       throw new ApiError(404, "PDF not available for this report");
//     }

//     const filename = `${report.source}_to_${report.destination}_report.pdf`
//       .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

//     console.log("📁 Filename:", filename);
//     console.log("📥 Fetching PDF from Cloudinary...");
//     console.log("🔗 URL:", report.pdfUrl);

//     // ⭐ Simply fetch the PDF from the direct URL (no transformations)
//     const response = await axios({
//       method: 'GET',
//       url: report.pdfUrl,
//       responseType: 'arraybuffer',
//       timeout: 30000,
//       maxRedirects: 5
//     });

//     console.log("📊 Response Status:", response.status);
//     console.log("📊 Content-Type:", response.headers['content-type']);
//     console.log("📊 Data Length:", response.data?.length || 0);

//     if (!response.data || response.data.length === 0) {
//       console.error("❌ Empty response from Cloudinary");
//       throw new Error("Empty PDF data received");
//     }

//     console.log("✅ PDF fetched successfully!");
//     console.log("📤 Setting headers and sending...");

//     // Set headers to force download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Length', response.data.length);
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Pragma', 'no-cache');

//     // Send the PDF
//     res.send(Buffer.from(response.data));

//     console.log("✅ Download complete!");
//     console.log("==========================================");

//   } catch (error) {
//     console.error("==========================================");
//     console.error("❌ DOWNLOAD ERROR:");
//     console.error("Type:", error.constructor.name);
//     console.error("Message:", error.message);
    
//     if (error.response) {
//       console.error("Response Status:", error.response.status);
//       console.error("Response StatusText:", error.response.statusText);
//       console.error("Response Headers:", error.response.headers);
      
//       // Try to get error body
//       const errorData = error.response.data;
//       if (errorData) {
//         if (Buffer.isBuffer(errorData)) {
//           console.error("Response Data:", errorData.toString('utf-8'));
//         } else {
//           console.error("Response Data:", errorData);
//         }
//       }
//     }
    
//     console.error("==========================================");
    
//     throw new ApiError(500, `Failed to download PDF: ${error.message}`);
//   }
// });