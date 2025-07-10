import express from 'express';
import { applySecurityMiddleware } from './middlewares/security.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './configs/swagger.config';
import paymentRouter from './routes/payment.route';
import transactionRouter from './routes/transaction.route';
import { errorHandler } from './handlers/error/error.handler';
import { globalErrorHandler } from './handlers/global/error.handler';
import redis from './providers/redis.provider';

const app = express();

// Initialize Redis connection (optional: log status)
redis.on('connect', () => {
  console.log('Connected to Redis');
});
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Apply security-related middleware
applySecurityMiddleware(app);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Payment routes
app.use('/', paymentRouter);
app.use('/', transactionRouter);

// API error handler
app.use(errorHandler);

// Global error handler (should be last)
app.use(globalErrorHandler);

export default app; 