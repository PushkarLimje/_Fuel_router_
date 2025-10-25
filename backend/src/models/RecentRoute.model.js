import mongoose from "mongoose";

const recentRouteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  recent: [
    {
      source: String,
      destination: String,
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("RecentRoute", recentRouteSchema);
