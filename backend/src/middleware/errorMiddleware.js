// @desc  Handle 404 Not Found
export const notFound = (req, res, next) => {
    const error = {
        statusCode: 404,
        message: `Route not found: ${req.originalUrl}`,
        isOperational: true,
        errors: [],
    };
    next(error);
};

// @desc  Central error handler
export const errorHandler = (err, req, res, next) => {

    // Our own ApiError — identified by isOperational flag
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors || [],
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            statusCode: 409,
            message: "Duplicate field value entered",
            errors: [],
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Validation failed",
            errors,
        });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Invalid token",
            errors: [],
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Token expired",
            errors: [],
        });
    }

    // Fallback
    const statusCode = err.statusCode || err.status || 500;
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || "Internal Server Error",
        errors: [],
    });
};