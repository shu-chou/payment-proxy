import { injectable } from 'inversify';
import { IFraudService } from '../interfaces/fraud.interface';
import fraudRules from '../configs/fraud.rules.json';

@injectable()
export class FraudService implements IFraudService {
  private rules = fraudRules;

  calculateRiskScore(amount: number, email: string): number {
    let score = 0;

    if (this.isLargeAmount(amount)) {
      score += this.rules.largeAmount.weight;
    }
    if (this.isSuspiciousDomain(email)) {
      score += this.rules.suspiciousDomains.weight;
    }
    return Math.min(score, 1);
  }

  isLargeAmount(amount: number): boolean {
    return amount >= this.rules.largeAmount.threshold;
  }

  isSuspiciousDomain(email: string): boolean {
    const domain = email.split('@')[1] || '';
    return this.rules.suspiciousDomains.domains.some((susp: string) => domain.endsWith(susp));
  }
} 