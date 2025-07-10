import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateRequest<T>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await validate(instance as object);
    if (errors.length > 0) {
      const messages = errors.flatMap(error => Object.values(error.constraints || {}));
      return res.status(400).json({ errors: messages });
    }
    req.body = instance;
    next();
  };
} 