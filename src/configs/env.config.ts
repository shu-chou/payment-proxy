import dotenv from 'dotenv';
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  FRAUD_LARGE_AMOUNT: parseInt(process.env.FRAUD_LARGE_AMOUNT || '1000', 10),
  FRAUD_SUSPICIOUS_DOMAINS: (process.env.FRAUD_SUSPICIOUS_DOMAINS || '.ru,test.com').split(','),
  PAYMENT_PROVIDERS: (process.env.PAYMENT_PROVIDERS || 'stripe,paypal').split(','),
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10),
  TRANSACTION_KEY: process.env.TRANSACTION_KEY || 'transactions',
};

export default config; 