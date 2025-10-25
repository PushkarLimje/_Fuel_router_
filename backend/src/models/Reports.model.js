// backend/src/models/Reports.model.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    routeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Route", 
        required: true 
    },
    // Route details (copied from Route for quick access)
    source: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: Number },
    
    // Report calculations
    fuelUsed: { type: Number },
    fuelCost: { type: Number }, // Cost of fuel
    avgMileage: { type: Number },
    
    // PDF storage
    pdfUrl: { 
        type: String, 
        default: null 
    }, // Cloudinary URL
    cloudinaryPublicId: { 
        type: String, 
        default: null 
    }, // For deletion
    
    // Report metadata
    reportName: { type: String },
    generatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);