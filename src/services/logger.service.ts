import { injectable } from 'inversify';
import { LogEntry, TransactionLog, ILoggerService } from '../interfaces/logger.interface';
import redis from '../providers/redis.provider';
import config from '../configs/env.config';

@injectable()
export class LoggerService implements ILoggerService {
  private logs: LogEntry[] = [];
  private static TRANSACTION_KEY = config.TRANSACTION_KEY;

  log(type: string, data: any) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      type,
      data,
    });
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  async logTransaction(entry: Omit<TransactionLog, 'timestamp'>) {
    const log: TransactionLog = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    await redis.lpush(LoggerService.TRANSACTION_KEY, JSON.stringify(log));
  }

  async getTransactionLogs(): Promise<TransactionLog[]> {
    const logs = await redis.lrange(LoggerService.TRANSACTION_KEY, 0, -1);
    return logs.map((item) => JSON.parse(item));
  }
} 