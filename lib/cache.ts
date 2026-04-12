// Simple in-memory cache for server-side API responses
// Survives across requests within the same Node.js process

interface CacheEntry {
  data: unknown
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

export function setCached(key: string, data: unknown, ttlSeconds = 3600) {
  cache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 })
}

export function makeCacheKey(...parts: string[]): string {
  return parts.join(':')
}
