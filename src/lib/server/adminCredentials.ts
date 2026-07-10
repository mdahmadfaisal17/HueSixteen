import { timingSafeEqual } from "crypto";
import { takeRateLimit } from "@/lib/server/rateLimit";

const LOGIN_LOCK_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const cleanEnvValue = (value: string | undefined) => {
  if (!value) {
    return "";
  }

  return value.trim().replace(/^['\"]|['\"]$/g, "");
};

const safeTextCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const loginAttemptKey = (email: string, ip: string) => `${normalizeEmail(email)}::${ip}`;

export const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  return forwardedFor.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
};

export const verifyAdminPassword = async ({
  email,
  password,
  ip,
}: {
  email: string;
  password: string;
  ip: string;
}) => {
  const adminEmail = cleanEnvValue(process.env.ADMIN_LOGIN_EMAIL);
  const adminPassword = cleanEnvValue(process.env.ADMIN_LOGIN_PASSWORD);

  if (!adminEmail || !adminPassword) {
    return { ok: false as const, reason: "config" as const };
  }

  const key = loginAttemptKey(email, ip);

  const isEmailMatch = safeTextCompare(normalizeEmail(email), normalizeEmail(adminEmail));
  const isPasswordMatch = safeTextCompare(password, adminPassword);

  if (!isEmailMatch || !isPasswordMatch) {
    const failedAttempts = await takeRateLimit({
      key: `admin-login-fail:${key}`,
      limit: LOGIN_MAX_ATTEMPTS,
      windowMs: LOGIN_LOCK_MS,
    });

    if (!failedAttempts.ok) {
      return { ok: false as const, reason: "locked" as const };
    }

    return { ok: false as const, reason: "invalid" as const };
  }

  return { ok: true as const, email: normalizeEmail(adminEmail) };
};
