import express from "express";
import morgan from "morgan";
import connectDB from "./src/server/dbconnect.js";
import dotenv from "dotenv";
import 'express-async-errors';
dotenv.config(); 
//import passport from 'passport';
import router from "./src/routes/route.js";
import { errorHandler } from './src/middleware/error-handler.js';
import { notFoundMiddleware } from './src/middleware/not-found.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(router);

// Error handling
app.use(notFoundMiddleware);
app.use(errorHandler);

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

