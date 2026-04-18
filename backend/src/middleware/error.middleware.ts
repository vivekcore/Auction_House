// src/middlewares/error.middleware.ts
import type{ Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong. Please try again later.';

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'This value already exists. Please use a different one.';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format. Please check the ID and try again.';
  }

  // Json web token error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
  }

  // Token expired error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please login again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};