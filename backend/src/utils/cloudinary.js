// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import dotenv from "dotenv";
// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//       folder: "upload",
//     });
//     fs.unlinkSync(localFilePath);
//     console.log(
//       "file has been uploaded successfull on cloudinary",
//       response.url
//     );
//     return response;
//   } catch (error) {
//     console.error("Cloudinary Upload Error:", error);
//     fs.unlinkSync(localFilePath);
//     return null;
//   }
// };

// export default uploadOnCloudinary ;
// backend/src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload images/videos
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "upload",
    });
    fs.unlinkSync(localFilePath);
    console.log(
      "file has been uploaded successfully on cloudinary",
      response.url
    );
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

// Upload PDFs - use auto type for better compatibility
const uploadPDFOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("📤 Uploading PDF to Cloudinary:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",     // Let Cloudinary detect type
      folder: "reports",
      public_id: `report_${Date.now()}`,
      type: "upload",            // Use 'upload' type (not 'private')
      access_control: [{         // Set access control
        access_type: "anonymous"
      }]
    });

    // Delete local file after upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.log("✅ PDF uploaded successfully");
    console.log("📄 URL:", response.secure_url);
    console.log("📄 Public ID:", response.public_id);
    
    return response;
  } catch (error) {
    console.error("❌ Cloudinary PDF Upload Error:", error);
    // Clean up local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export default uploadOnCloudinary;
export { uploadPDFOnCloudinary };