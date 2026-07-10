type PortfolioApiItem = {
  id?: string;
  title?: string;
  category?: string;
  featuredSlot?: string;
  image?: string;
  tag?: string[];
  link?: string;
  projectLink?: string;
};

type PortfolioCachePayload = {
  timestamp: number;
  data: PortfolioApiItem[];
};

const CACHE_KEY = "huesixteen:portfolios:cache";
const CACHE_TTL_MS = 0;

let inMemoryCache: PortfolioCachePayload | null = null;

const isFresh = (payload: PortfolioCachePayload) => Date.now() - payload.timestamp < CACHE_TTL_MS;

const readSessionCache = (): PortfolioCachePayload | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(CACHE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PortfolioCachePayload;

    if (!Array.isArray(parsed.data) || typeof parsed.timestamp !== "number") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeSessionCache = (payload: PortfolioCachePayload) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
};

export const fetchPortfoliosCached = async (options?: { force?: boolean }) => {
  const force = options?.force ?? false;

  if (!force && inMemoryCache && isFresh(inMemoryCache)) {
    return inMemoryCache.data;
  }

  if (!force) {
    const sessionCache = readSessionCache();

    if (sessionCache && isFresh(sessionCache)) {
      inMemoryCache = sessionCache;
      return sessionCache.data;
    }
  }

  const response = await fetch("/api/portfolios", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch portfolios.");
  }

  const json = await response.json();

  if (!Array.isArray(json)) {
    throw new Error("Invalid portfolios payload.");
  }

  const payload: PortfolioCachePayload = {
    timestamp: Date.now(),
    data: json,
  };

  inMemoryCache = payload;
  writeSessionCache(payload);

  return payload.data;
};

export const clearPortfolioCache = () => {
  inMemoryCache = null;

  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(CACHE_KEY);
  }
};
