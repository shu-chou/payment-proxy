import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

export function applySecurityMiddleware(app: Express) {
  // Secure HTTP headers
  app.use(helmet());
  app.disable('x-powered-by');

  // CORS - restrict as needed (currently allows all, adjust for production)
  app.use(cors({
    origin: '*', // TODO: Replace with specific origins in production
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Body size limiting
  app.use(require('express').json({ limit: '1mb' }));

  // Prevent HTTP Parameter Pollution
  app.use(hpp());


  // Redirect HTTP to HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, 'https://' + req.headers.host + req.url);
      }
      next();
    });
  }
} 