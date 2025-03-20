import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();



const connectDB = async () => {
    const uri = process.env.DB_URI;


    if(!uri) {
        console.error("DB_URI cannot be found in the environment variable");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB");
        await mongoose.connect(uri, {});
        console.log("Database has been connected successfully...");

    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    }
};

export default connectDB;