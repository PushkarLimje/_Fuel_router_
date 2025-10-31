import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User", 
     required: true 
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

  // ⭐ ADD THESE NEW FIELDS:
  tripId: { type: String, unique: true },
  routeType: { type: String, enum: ['Eco', 'Fast', 'Shortest'], default: 'Eco' },
  actualMileage: { type: Number }, // Actual mileage achieved during trip
  co2SavedKg: { type: Number, default: 0 },

  date: { 
    type: Date, 
    default: Date.now 
    }
}, { timestamps: true });

// ⭐ ADD PRE-SAVE HOOK TO GENERATE TRIP ID:
routeSchema.pre('save', function(next) {
  if (!this.tripId) {
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    this.tripId = `TRIP-${random}`;
  }
  next();
});

export default mongoose.model("Route", routeSchema);
