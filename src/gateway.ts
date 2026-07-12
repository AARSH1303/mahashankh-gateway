import { db } from './db';
import { users } from './schema';
import { redisClient } from './redis';
import { eq } from 'drizzle-orm';

const CACHE_TTL = 3600; // 1 hour expiration (Entity Invalidation)

export class DatabaseGateway {
  
  // 1. Entity Synchronizer & Read-Through Cache
  static async getUserById(userId: number) {
    const cacheKey = `user:${userId}`;
    
    // Check Redis First
    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      console.log(`[CACHE HIT] User ${userId}`);
      return JSON.parse(cachedUser);
    }

    console.log(`[CACHE MISS] Fetching User ${userId} from DB`);
    // Fallback to PostgreSQL
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = result[0];

    // Synchronize Entity (Save back to Redis)
    if (user) {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(user));
    }
    return user;
  }

  // 2. Write-Through Cache Workflow
  static async createUser(name: string, email: string) {
    // Write to PostgreSQL
    const result = await db.insert(users).values({ name, email }).returning();
    const newUser = result[0];

    // Write-Through to Redis immediately
    const cacheKey = `user:${newUser.id}`;
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(newUser));
    console.log(`[WRITE-THROUGH] Saved User ${newUser.id} to DB and Cache`);

    return newUser;
  }
}