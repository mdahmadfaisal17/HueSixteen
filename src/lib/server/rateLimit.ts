import { getDatabase } from "@/lib/mongodb";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
  backend: "upstash" | "mongodb" | "memory";
};

type MongoRateLimitDoc = {
  key: string;
  count: number;
  expiresAt: Date;
};

const store = new Map<string, RateLimitEntry>();
const MONGO_RATE_LIMIT_COLLECTION = "rate_limits";

let mongoIndexesReady: Promise<void> | null = null;

const getRedisConfig = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    token,
  };
};

const ensureMongoRateLimitIndexes = async () => {
  if (!mongoIndexesReady) {
    mongoIndexesReady = (async () => {
      const db = await getDatabase();
      const collection = db.collection<MongoRateLimitDoc>(MONGO_RATE_LIMIT_COLLECTION);

      await Promise.all([
        collection.createIndex({ key: 1 }, { unique: true, name: "rate_limit_key_unique" }),
        collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "rate_limit_expires_ttl" }),
      ]);
    })();
  }

  await mongoIndexesReady;
};

const takeInMemoryRateLimit = ({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult => {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const nextEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, nextEntry);
    return {
      ok: true as const,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
      backend: "memory" as const,
    };
  }

  if (existing.count >= limit) {
    return {
      ok: false as const,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      backend: "memory" as const,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    ok: true as const,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    backend: "memory" as const,
  };
};

const takeMongoRateLimit = async ({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) => {
  await ensureMongoRateLimitIndexes();

  const now = Date.now();
  const bucketStart = Math.floor(now / windowMs) * windowMs;
  const bucketEnd = bucketStart + windowMs;
  const bucketKey = `${key}:${bucketStart}`;

  const db = await getDatabase();
  const collection = db.collection<MongoRateLimitDoc>(MONGO_RATE_LIMIT_COLLECTION);

  const updateResult = await collection.findOneAndUpdate(
    { key: bucketKey },
    {
      $inc: { count: 1 },
      $setOnInsert: {
        key: bucketKey,
        expiresAt: new Date(bucketEnd),
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  const count = updateResult?.count ?? 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((bucketEnd - now) / 1000));

  if (count > limit) {
    return {
      ok: false as const,
      remaining: 0,
      retryAfterSeconds,
      backend: "mongodb" as const,
    };
  }

  return {
    ok: true as const,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds,
    backend: "mongodb" as const,
  };
};

const takeUpstashRateLimit = async ({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) => {
  const redis = getRedisConfig();

  if (!redis) {
    return null;
  }

  const response = await fetch(`${redis.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redis.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, windowMs, "NX"],
      ["PTTL", key],
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Upstash rate-limit request failed.");
  }

  const json = await response.json();

  if (!Array.isArray(json) || !json[0] || typeof json[0].result !== "number") {
    throw new Error("Invalid Upstash pipeline response.");
  }

  const count = json[0].result as number;
  const ttlMs = typeof json[2]?.result === "number" ? json[2].result : windowMs;

  if (count > limit) {
    return {
      ok: false as const,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
      backend: "upstash" as const,
    };
  }

  return {
    ok: true as const,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
    backend: "upstash" as const,
  };
};

export const takeRateLimit = async ({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) => {
  try {
    const distributedResult = await takeUpstashRateLimit({ key, limit, windowMs });

    if (distributedResult) {
      return distributedResult;
    }
  } catch {
    // Fall through to DB-backed throttling when Upstash is unavailable.
  }

  try {
    return await takeMongoRateLimit({ key, limit, windowMs });
  } catch {
    // Fall back to in-memory throttling when external stores are unavailable.
  }

  return takeInMemoryRateLimit({ key, limit, windowMs });
};
