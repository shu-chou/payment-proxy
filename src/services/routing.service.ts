import { injectable } from 'inversify';

export interface RoutePaymentResult {
  transactionId: string;
  provider: string;
  status: 'success' | 'failure';
  explanation: string;
}

@injectable()
export class RoutingService {
  routePayment(
    amount: number,
    currency: string,
    source: string,
    email: string,
    riskScore: number,
    isLargeAmount: boolean,
    isSuspiciousDomain: boolean
  ): RoutePaymentResult {
    let provider: string;
    let explanation: string;

    if (isSuspiciousDomain) {
      provider = 'paypal';
      explanation = 'This payment was routed to PayPal due to a suspicious email domain.';
    } else if (isLargeAmount) {
      provider = 'paypal';
      explanation = 'This payment was routed to PayPal due to a large amount.';
    } else {
      provider = 'stripe';
      explanation = 'This payment was routed to Stripe due to a low risk score.';
    }

    // Simulate transaction ID
    const transactionId = `txn_${Math.random().toString(36).slice(2, 11)}`;
    return {
      transactionId,
      provider,
      status: 'success',
      explanation,
    };
  }
} 