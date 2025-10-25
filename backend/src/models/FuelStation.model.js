import mongoose from "mongoose";

const fuelStationSchema = new mongoose.Schema({

    name: { 
        type: String, 
        required: true 
    },

    brand: { 
        type: String 
    },

    address: { 
        type: String 
    },

    lat: { 
        type: Number, 
        required: true 
    },

    lng: { 
        type: Number, 
        required: true 
    },

    fuelPrice: { 
        type: Number 
    }, // optional if you fetch dynamically

    rating: { 
        type: Number, 
        default: 0 
    }
    
    }, { timestamps: true });

export default mongoose.model("FuelStation", fuelStationSchema);
