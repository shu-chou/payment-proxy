import { Request, Response, NextFunction } from 'express';
import logger from '../../providers/logger.provider';

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  }, 'Unhandled Error');

  res.status(500).json({
    statusCode: 500,
    message: 'Something went wrong. Please try again later.'
  });
} 