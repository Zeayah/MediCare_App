import mongoose from "mongoose"; 



const userSchema =  new mongoose.Schema({
    firstname: {
        type: string,
        required: [true, "First name is required"],
        unique: [true, "First name must be unique"],
        trim: true,
    },
    lastname: {
        type: string,
        required: [true, "Last name is required"],
        unique: [true, "Last name must be unique"],
        trim: true,
    },
    email:{
        type: string,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone:{
        type: string,
        required: [true, "Phone number is required"],
        unique: true,
    },
    nationalID:{
        type: String,
        required: [true, 'National ID is required'],
        unique: true,
        trim: true,
    },
    dateOfBirth: {
        type: Date
      }, 
      googleID:{
        type: string,
        sparse: true,
      },
      password:{
        type: string,
        required: function() {
            //Password only required if not using OAuth
            return !this.googleID; 
        },
        select: false,
      },
      role:{
        type: string,
        enum: ["Doctor", "Patient", "Admin"],
        required: true,
    },
    gender:{
        type: string,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    isAuthenticated:{
        type: boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
        select: false,
      },
      resetPasswordExpires: {
        type: Date,
        select: false,
      },
},
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;