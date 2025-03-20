import {StatusCodes} from "http-status-codes";

//Base class for custom API errors
class CustomAPIError extends Error {
    constructor(message, StatusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = this.statusCode;
        this.status ="${statusCode}".startsWith("4") ? "fail" : "error";
        this.Operational = true;

        Error.captureStackTrace(this, this.construction);
    }
};

export default CustomAPIError;