export interface ILLMService {
  generateRiskExplanation(prompt: string): Promise<string>;
} 