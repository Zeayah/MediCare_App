import express from "express";
import morgan from "morgan";
import connectDB from "./src/server/dbconnect.js";
import dotenv from "dotenv";
dotenv.config(); 



const app = express();
app.use(morgan);
app.use(express.json());

const port = process.env.PORT || 6000

const start = async () => {
    try {
        await connectDB()
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.log("Error starting the server", error);
    }
};

start();

