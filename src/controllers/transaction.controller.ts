import { Request, Response, NextFunction } from 'express';
import container from '../configs/inversify.config';
import TYPES from '../types/types';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    const transactionService = container.get<TransactionService>(TYPES.TransactionService);
    const transactions = await transactionService.getAllTransactions();
    return res.status(200).json(transactions);
  }
} 