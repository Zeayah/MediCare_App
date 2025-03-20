import CustomAPIError from "./custom-api";;
import {StatusCodes} from "http-status-codes";

export class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED);
    };
};