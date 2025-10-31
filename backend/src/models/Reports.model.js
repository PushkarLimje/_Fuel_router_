
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
    
    // Route details
    source: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: Number },
    
    // Report calculations
    fuelUsed: { type: Number },
    fuelCost: { type: Number },
    avgMileage: { type: Number },
    
    // ⭐ ADD THESE NEW FIELDS FOR RECEIPT:
    
    // Fuel Station Information
    fuelStation: {
      id: { type: String },
      name: { type: String },
      brand: { type: String, enum: ['HP', 'BPCL', 'IOCL', 'Shell', 'Essar', 'Reliance'] },
      address: { type: String },
      location: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    
    // Transaction Details
    transaction: {
      dateTime: { type: Date, default: Date.now },
      fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG'] },
      pricePerUnit: { type: Number }, // Price per liter
      quantity: { type: Number }, // Liters purchased
      totalCost: { type: Number }, // Before GST
      paymentMode: { type: String, enum: ['UPI', 'Cash', 'Card', 'Wallet'] },
      paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Paid' },
      gst: { type: Number, default: 5 }, // GST percentage
      grandTotal: { type: Number } // After GST
    },
    
    // Trip Context (already have most of this)
    tripContext: {
      routeType: { type: String, enum: ['Eco', 'Fast', 'Shortest'], default: 'Eco' },
      co2SavedKg: { type: Number, default: 0 }
    },
    
    // System Information
    system: {
      apiSource: { type: String, default: "TomTom Routing API" },
      device: { type: String, enum: ['Android', 'iOS', 'Web'], default: 'Web' },
      verified: { type: Boolean, default: true }
    },
    
    // PDF storage (existing)
    pdfUrl: { type: String, default: null },
    cloudinaryPublicId: { type: String, default: null },
    
    // Report metadata
    reportName: { type: String },
    receiptId: { type: String, unique: true }, // ⭐ ADD THIS
    generatedAt: { type: Date, default: Date.now }
    
}, { timestamps: true });

// ⭐ ADD PRE-SAVE HOOK TO GENERATE RECEIPT ID:
reportSchema.pre('save', function(next) {
  if (!this.receiptId) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    this.receiptId = `RCPT-${year}-${random}`;
  }
  next();
});

export default mongoose.model("Report", reportSchema);

// // backend/src/models/Reports.model.js
// import mongoose from "mongoose";

// const reportSchema = new mongoose.Schema({
//     userId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "User", 
//         required: true 
//     },
//     routeId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "Route", 
//         required: true 
//     },
//     // Route details (copied from Route for quick access)
//     source: { type: String, required: true },
//     destination: { type: String, required: true },
//     distance: { type: Number, required: true },
//     duration: { type: Number },
    
//     // Report calculations
//     fuelUsed: { type: Number },
//     fuelCost: { type: Number }, // Cost of fuel
//     avgMileage: { type: Number },
    
//     // PDF storage
//     pdfUrl: { 
//         type: String, 
//         default: null 
//     }, // Cloudinary URL
//     cloudinaryPublicId: { 
//         type: String, 
//         default: null 
//     }, // For deletion
    
//     // Report metadata
//     reportName: { type: String },
//     generatedAt: { 
//         type: Date, 
//         default: Date.now 
//     }
// }, { timestamps: true });

// export default mongoose.model("Report", reportSchema);