import { Request, Response, NextFunction } from 'express';
import logger from '../../providers/logger.provider';

export class ApiError extends Error {
  statusCode: number;
  details?: any;
  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : 'Internal Server Error';
  const details = err instanceof ApiError ? err.details : undefined;

  // Log the error
  logger.error({
    statusCode,
    message,
    details,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  }, 'API Error');

  const response: any = {
    statusCode,
    message,
  };
  if (details) {
    response.details = details;
  }
  res.status(statusCode).json(response);
} 