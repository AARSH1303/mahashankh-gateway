import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// We will call this before our server starts
export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}