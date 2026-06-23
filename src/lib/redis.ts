/**
 * Upstash Redis client + typed cache helpers for the NL->SQL pipeline.
 * Upstash's REST client is HTTP-based, which makes it safe to use from
 * serverless Next.js route handlers (no persistent TCP connection to manage).
 */
import { Redis } from '@upstash/redis';
import type { ChatApiResponse } from '@/types/chat';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CHAT_CACHE_TTL_SECONDS = 60 * 60; // 1 hour, per spec

export async function getCachedChatResult(cacheKey: string): Promise<ChatApiResponse | null> {
  try {
    const value = await redis.get<ChatApiResponse>(cacheKey);
    return value ?? null;
  } catch (err) {
    // Redis being unavailable should degrade to a cache miss, not break chat.
    console.error('Redis GET failed, falling back to cache miss:', err);
    return null;
  }
}

export async function setCachedChatResult(cacheKey: string, value: ChatApiResponse): Promise<void> {
  try {
    await redis.set(cacheKey, value, { ex: CHAT_CACHE_TTL_SECONDS });
  } catch (err) {
    console.error('Redis SET failed (non-fatal):', err);
  }
}
