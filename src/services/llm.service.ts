import OpenAI from 'openai';
import config from '../configs/env.config';
import redis from '../providers/redis.provider';

export class LLMService {
  private openai: OpenAI;
  private CACHE_TTL_SECONDS = config.CACHE_TTL_SECONDS; // 1 hour

  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.OPENROUTER_API_KEY,
      defaultHeaders: {
        // Optionally set these for OpenRouter rankings
        // 'HTTP-Referer': '<YOUR_SITE_URL>',
        // 'X-Title': '<YOUR_SITE_NAME>',
      },
    });
  }

  async generateRiskExplanation(prompt: string): Promise<string> {
    const cacheKey = `llm:explanation:${Buffer.from(prompt).toString('base64')}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached;
    }
    const completion = await this.openai.chat.completions.create({
      model: 'google/gemma-3-12b-it:free',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    const explanation = completion.choices[0]?.message?.content || '';
    await redis.set(cacheKey, explanation, 'EX', this.CACHE_TTL_SECONDS);
    return explanation;
  }
} 