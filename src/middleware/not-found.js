/**
 * Middleware to handle 404 Not Found errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
import { StatusCodes } from 'http-status-codes';

export const notFoundMiddleware = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ msg: 'Route does not exist' });
}; 