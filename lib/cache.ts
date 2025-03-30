import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export interface CacheEntry<T> {
  data: T
  timestamp: number
}

export async function getCache<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const data = await redis.get<CacheEntry<T>>(key)
    return data
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setCache<T>(key: string, value: CacheEntry<T>): Promise<void> {
  try {
    await redis.set(key, value)
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
} 