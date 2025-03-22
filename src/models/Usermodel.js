import mongoose from "mongoose"; 
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone:{
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
    },
    nationalID:{
        type: String,
        trim: true,
        sparse: true,
        unique: true
    },
    dateOfBirth: {
        type: Date
    }, 
    googleID:{
        type: String,
        sparse: true,
    },
    password:{
        type: String,
        required: function() {
            return !this.googleID; 
        }
    },
    role:{
        type: String,
        enum: ["Doctor", "Patient"],
        required: true,
    },
    gender:{
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    isAuthenticated:{
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetPasswordExpires: {
        type: Date,
        select: false,
    }
},
{ timestamps: true }
);

// Add comparePassword method to the schema
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) {
        throw new Error('No password set for this user');
    }
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const User = mongoose.model("User", userSchema);
export default User;