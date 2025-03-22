import mongoose from "mongoose";



const doctorSchema =  new mongoose.Schema({
    name:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    specialization:{
        type: String,
        required: true,
    },
    availableSlots: [{
        startTime: Date,
        endTime: Date,
    }],
    location:{
        type: {
            type: String,
            enum: ["Point"],//GeoJSON type
            required: true,
        },
        coordinates: {
            type:[Number],//[longitude, latitude]
            required: true,
        },
    },
    
});

// a geospatial index for efficient location-based queries
doctorSchema.index({ location: "2dsphere"});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;