export interface IFraudService {
  calculateRiskScore(amount: number, email: string): number;
  isLargeAmount(amount: number): boolean;
  isSuspiciousDomain(email: string): boolean;
} 