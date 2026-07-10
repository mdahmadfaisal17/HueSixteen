import { createSign } from "crypto";

type GaOverview = {
  configured: boolean;
  summary: Array<{
    label: string;
    value: string;
    change: string;
    icon: "users" | "sessions" | "views" | "bounce";
  }>;
  trend: Array<{
    date: string;
    value: number;
  }>;
};

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REPORT_ENDPOINT = "https://analyticsdata.googleapis.com/v1beta";
const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

const base64UrlEncode = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const getServiceAccountConfig = () => {
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim();
  const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (!propertyId || !clientEmail || !privateKey) {
    return null;
  }

  return { propertyId, clientEmail, privateKey };
};

const createGoogleAccessToken = async () => {
  const config = getServiceAccountConfig();

  if (!config) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: config.clientEmail,
    scope: GA_SCOPE,
    aud: TOKEN_ENDPOINT,
    exp: now + 3600,
    iat: now,
  };

  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const signature = signer.sign(config.privateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const assertion = `${unsignedToken}.${signature}`;

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to get GA access token: ${await response.text()}`);
  }

  const json = await response.json();
  return { accessToken: json.access_token as string, propertyId: config.propertyId };
};

const runReport = async ({
  accessToken,
  propertyId,
  body,
}: {
  accessToken: string;
  propertyId: string;
  body: Record<string, unknown>;
}) => {
  const response = await fetch(`${REPORT_ENDPOINT}/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GA report: ${await response.text()}`);
  }

  return response.json();
};

const formatDuration = (secondsString: string) => {
  const seconds = Math.round(Number(secondsString) || 0);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const formatCompact = (valueString: string) => {
  const value = Number(valueString) || 0;
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
};

const formatPercent = (valueString: string) => `${Math.round((Number(valueString) || 0) * 100)}%`;

export const getGoogleAnalyticsOverview = async (): Promise<GaOverview> => {
  const tokenConfig = await createGoogleAccessToken();

  if (!tokenConfig) {
    return {
      configured: false,
      summary: [],
      trend: [],
    };
  }

  const [summaryReport, trendReport] = await Promise.all([
    runReport({
      accessToken: tokenConfig.accessToken,
      propertyId: tokenConfig.propertyId,
      body: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
        ],
      },
    }),
    runReport({
      accessToken: tokenConfig.accessToken,
      propertyId: tokenConfig.propertyId,
      body: {
        dateRanges: [{ startDate: "14daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      },
    }),
  ]);

  const summaryValues = summaryReport?.rows?.[0]?.metricValues ?? [];
  const trendRows = Array.isArray(trendReport?.rows) ? trendReport.rows : [];

  return {
    configured: true,
    summary: [
      {
        label: "Active users",
        value: formatCompact(summaryValues[0]?.value || "0"),
        change: "Last 30 days",
        icon: "users",
      },
      {
        label: "Sessions",
        value: formatCompact(summaryValues[1]?.value || "0"),
        change: "Last 30 days",
        icon: "sessions",
      },
      {
        label: "Page views",
        value: formatCompact(summaryValues[2]?.value || "0"),
        change: "Last 30 days",
        icon: "views",
      },
      {
        label: "Bounce rate",
        value: formatPercent(summaryValues[3]?.value || "0"),
        change: "Last 30 days",
        icon: "bounce",
      },
    ],
    trend: trendRows.map((row: { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }) => ({
      date: row.dimensionValues?.[0]?.value || "",
      value: Number(row.metricValues?.[0]?.value || "0"),
    })),
  };
};
