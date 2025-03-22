import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/unauthenticated.js';
import User from '../models/Usermodel.js';

/**
 * Authenticate user middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticateUser = async (req, res, next) => {
    try {
        // Check header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const token = authHeader.split(' ')[1];

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not configured');
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach the user and their permissions to the req object
            const user = await User.findById(payload.userId).select('-password');
            if (!user) {
                throw new UnauthenticatedError('User not found');
            }

            // Verify role is valid
            if (!['Doctor', 'Patient'].includes(user.role)) {
                throw new UnauthenticatedError('Invalid user role');
            }

            req.user = user;
            req.user.role = payload.role;
            next();
        } catch (error) {
            throw new UnauthenticatedError('Authentication invalid');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Authorize user roles middleware
 * @param {...string} roles - Allowed roles
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthenticatedError('Not authorized to access this route');
        }
        next();
    };
};

export { authorizeRoles };