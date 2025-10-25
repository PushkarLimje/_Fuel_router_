import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User", required: true 
    },

    source: { 
        type: String,
        required: true 
    },

    destination: { 
        type: String, 
        required: true 
    },

    distance: { 
        type: Number, 
        required: true 
    }, // in km
    
    duration: { 
        type: Number
    }, // in minutes or seconds

    fuelRequired: { 
        type: Number,
        default: 0 
    },

    pathCoordinates: [
        { 
            lat: { 
                type: Number, 
                required: true 
            }, 
            lng: { 
                type: Number, 
                required: true 
            } 
        }
  ],
  date: { 
    type: Date, 
    default: Date.now 
    }
}, { timestamps: true });

export default mongoose.model("Route", routeSchema);
