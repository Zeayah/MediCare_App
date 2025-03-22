import CustomAPIError from './custom-api.js';
import {StatusCodes} from "http-status-codes";

class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.statusCode = 401;
    }
}

export { UnauthenticatedError };