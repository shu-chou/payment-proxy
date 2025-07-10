import { injectable, inject } from 'inversify';
import TYPES from '../types/types';
import { LoggerService } from './logger.service';
import { TransactionLog } from '../interfaces/logger.interface';

@injectable()
export class TransactionService {
  constructor(@inject(TYPES.LoggerService) private loggerService: LoggerService) {}

  async getAllTransactions(): Promise<TransactionLog[]> {
    return await this.loggerService.getTransactionLogs();
  }
} 