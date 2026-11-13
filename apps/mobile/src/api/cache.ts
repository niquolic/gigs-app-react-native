type CacheEntry<T> = {
  value?: T;
  expiresAt: number;
  pending?: Promise<T>;
};

const DEFAULT_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, CacheEntry<unknown>>();
let cacheGeneration = 0;

/**
 * Small in-memory API cache. Entries expire after 30 minutes and concurrent
 * requests for the same key share one network request.
 */
export async function withApiCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();
  const generation = cacheGeneration;
  const existing = cache.get(key) as CacheEntry<T> | undefined;

  if (existing?.value !== undefined && existing.expiresAt > now) {
    return existing.value;
  }

  if (existing?.pending) {
    return existing.pending;
  }

  const entry: CacheEntry<T> = { expiresAt: now + ttlMs };
  const pending = fetcher()
    .then((value) => {
      entry.value = value;
      entry.expiresAt = Date.now() + ttlMs;
      entry.pending = undefined;
      if (generation === cacheGeneration) {
        cache.set(key, entry);
      }
      return value;
    })
    .catch((error) => {
      if (generation === cacheGeneration) {
        cache.delete(key);
      }
      throw error;
    });

  entry.pending = pending;
  cache.set(key, entry);
  return pending;
}

/** Clear every cached API response after a gig mutation or account change. */
export function clearApiCache(): void {
  cacheGeneration += 1;
  cache.clear();
}
