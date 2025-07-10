import { RoutePaymentResult } from '../services/routing.service';

export interface IRoutingService {
  routePayment(amount: number, currency: string, source: string, email: string, riskScore: number, isLargeAmount: boolean, isSuspiciousDomain: boolean): RoutePaymentResult;
} 