const errorHandler = (err, req, res, next) => {
    console.error("Error caught:", err.message || err);

    const statusCode = err.status || res.statusCode !== 200 ? res.statusCode : 500;

    const response = {
        success: false,
        message: err.message || "Internal Server Error",
    };

    // Add validation details if they exist
    if (err.details) {
        response.details = err.details;
    }

    // Handle specific error types
    if (err.name === 'ValidationError') {
        response.message = 'Validation failed';
        response.details = Object.values(err.errors).map(e => e.message);
    } else if (err.name === 'CastError') {
        response.message = 'Invalid ID format';
    } else if (err.code === 11000) {
        response.message = 'Duplicate field value';
    }

    res.status(statusCode).json(response);
};

export default errorHandler;