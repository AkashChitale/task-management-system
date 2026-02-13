export class AppError extends Error{
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // This flag can be used to distinguish between operational errors and programming errors
        Error.captureStackTrace(this, this.constructor); // This captures the stack trace and excludes the constructor from it
    }
}