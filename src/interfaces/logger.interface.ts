export interface LogEntry {
  timestamp: string;
  type: string;
  data: any;
}

export interface TransactionLog {
  timestamp: string;
  transactionId: string | null;
  provider: string | null;
  status: string;
  riskScore: number;
  explanation: string;
  amount: number;
  currency: string;
  email: string;
}

export interface ILoggerService {
  log(type: string, data: any): void;
  getLogs(): LogEntry[];
  logTransaction(entry: Omit<TransactionLog, 'timestamp'>): Promise<void>;
  getTransactionLogs(): Promise<TransactionLog[]>;
} 