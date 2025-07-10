import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from '../types/types';
import { IFraudService } from '../interfaces/fraud.interface';
import { FraudService } from '../services/fraud.service';
import { IRoutingService } from '../interfaces/routing.interface';
import { RoutingService } from '../services/routing.service';
import { ILLMService } from '../interfaces/llm.interface';
import { LLMService } from '../services/llm.service';
import { LoggerService } from '../services/logger.service';
import { TransactionService } from '../services/transaction.service';

const container = new Container();

container.bind<IFraudService>(TYPES.FraudService).to(FraudService);
container.bind<IRoutingService>(TYPES.RoutingService).to(RoutingService);
container.bind<ILLMService>(TYPES.LLMService).to(LLMService);
container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);
container.bind<TransactionService>(TYPES.TransactionService).to(TransactionService);

export default container; 