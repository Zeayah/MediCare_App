import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, please try again later'
    };

    // Handle validation errors
    if (err.name === 'ValidationError') {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = Object.values(err.errors)
            .map(item => item.message)
            .join(', ');
    }

    // Handle duplicate key errors
    if (err.code && err.code === 11000) {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field`;
    }

    // Handle cast errors
    if (err.name === 'CastError') {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = `Invalid ${err.path}: ${err.value}`;
    }

    return res.status(customError.statusCode).json({
        success: false,
        error: {
            message: customError.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};
