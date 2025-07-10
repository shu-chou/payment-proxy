
import { Router } from 'express';
import { validateRequest } from '../handlers/requests/payment.handler';
import { PaymentRequestDto } from '../dtos/request/payment.request.dto';
import { PaymentController } from '../controllers/payment.controller';
import { asyncHandler } from '../handlers/global/async.handler';

const router = Router();

// POST /charge
router.post('/charge', validateRequest(PaymentRequestDto), asyncHandler(PaymentController.charge));

export default router; 