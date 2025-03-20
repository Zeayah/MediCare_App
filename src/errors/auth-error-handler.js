import {StatusCodes} from "http-status-codes";

    //Handles authentication-specific errors
const authErrorHandler = (err, req, res, next) => {
    console.error("Auth error:", {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV ==="development" ? err.stack: undefined
    });

    //Handles specific auth errors
    if (err.name === "UnauthenticatedError") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: err.message || "Authrntication failed"
        });
    }

    //Handles JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: "Invalid or expired token"
        });
    };   

        //Passes other errors to the main error handler
        next(err);
    

};

export default authErrorHandler;