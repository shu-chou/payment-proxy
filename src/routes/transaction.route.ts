
import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { asyncHandler } from '../handlers/global/async.handler';

const router = Router();

router.get('/transactions', asyncHandler(TransactionController.getAll));

export default router; 