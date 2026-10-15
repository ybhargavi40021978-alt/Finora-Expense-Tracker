const errorHandler = (err, req, res, next) => {
  console.error('[Finora Server Error]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const field of Object.keys(err.errors)) {
      errors[field] = err.errors[field].message;
    }
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      errors,
      message: 'One or more fields failed validation.'
    });
  }

  // Mongoose CastError (invalid ObjectId, invalid date, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid Input',
      message: `Invalid format for field "${err.path}".`
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: 'A duplicate record already exists.'
    });
  }

  // Default internal server error (never leak internal stack trace)
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
    message: statusCode === 500 ? 'An unexpected server error occurred. Please try again later.' : err.message
  });
};

module.exports = errorHandler;
