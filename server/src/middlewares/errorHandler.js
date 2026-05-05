const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Duplicate key error (Sequelize/MySQL or Mongo legacy compatibility)
  if (err.name === 'SequelizeUniqueConstraintError' || err.code === 11000) {
    statusCode = 409;
    const field = err.errors?.[0]?.path || Object.keys(err.keyValue || {})[0] || 'field';
    message = `A user with this ${field} already exists.`;
  }

  // Validation error
  if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
    statusCode = 400;
    const errors = Array.isArray(err.errors)
      ? err.errors.map((e) => e.message)
      : Object.values(err.errors || {}).map((e) => e.message);
    message = errors.join('. ');
  }

  // Invalid id/foreign key format
  if (err.name === 'CastError' || err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid ID format.';
  }

  const response = {
    success: false,
    message,
  };

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
