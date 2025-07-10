import { Request, Response, NextFunction } from 'express';
import container from '../configs/inversify.config';
import TYPES from '../types/types';
import { IFraudService } from '../interfaces/fraud.interface';
import { IRoutingService } from '../interfaces/routing.interface';
import { ILLMService } from '../interfaces/llm.interface';
import { LoggerService } from '../services/logger.service';
import { buildLLMPrompt, cleanLLMExplanation } from '../utils/common.util';

export class PaymentController {
  static async charge(req: Request, res: Response, next: NextFunction) {
    const fraudService = container.get<IFraudService>(TYPES.FraudService);
    const routingService = container.get<IRoutingService>(TYPES.RoutingService);
    const llmService = container.get<ILLMService>(TYPES.LLMService);
    const loggerService = container.get<LoggerService>(TYPES.LoggerService);

    const { amount, currency, source, email } = req.body;
    const riskScore = fraudService.calculateRiskScore(amount, email);
    const isLargeAmount = fraudService.isLargeAmount(amount);
    const isSuspiciousDomain = fraudService.isSuspiciousDomain(email);

    if (riskScore < 0.5) {
      const result = routingService.routePayment(
        amount,
        currency,
        source,
        email,
        riskScore,
        isLargeAmount,
        isSuspiciousDomain
      );
      const prompt = buildLLMPrompt({ amount, currency, email, riskScore, isLargeAmount, isSuspiciousDomain, routedProvider: result.provider });
      const explanationRaw = await llmService.generateRiskExplanation(prompt);
      const explanation = cleanLLMExplanation(explanationRaw);
      await loggerService.logTransaction({
        transactionId: result.transactionId,
        provider: result.provider,
        status: result.status,
        riskScore,
        explanation,
        amount,
        currency,
        email,
      });
      return res.status(200).json({ ...result, riskScore, explanation });
    }

    // Blocked case
    const prompt = buildLLMPrompt({ amount, currency, email, riskScore, isLargeAmount, isSuspiciousDomain });
    const explanationRaw = await llmService.generateRiskExplanation(prompt);
    const explanation = cleanLLMExplanation(explanationRaw);
    await loggerService.logTransaction({
      transactionId: null,
      provider: null,
      status: 'blocked',
      riskScore,
      explanation,
      amount,
      currency,
      email,
    });
    return res.status(200).json({
      transactionId: null,
      provider: null,
      status: 'blocked',
      riskScore,
      explanation,
    });
  }
} 