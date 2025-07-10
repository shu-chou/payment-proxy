import Redis from 'ioredis';
import config from '../configs/env.config';

const redis = new Redis({
  host: config.REDIS_HOST || 'localhost',
  port: config.REDIS_PORT || 6379,
  password: config.REDIS_PASSWORD || undefined,
  db: config.REDIS_DB || 0,
});

export default redis; 