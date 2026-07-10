import { randomBytes, createHash, timingSafeEqual } from "crypto";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

const ADMIN_OTP_COLLECTION = "admin_otp_challenges";

const getNumberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const OTP_LENGTH = getNumberFromEnv(process.env.ADMIN_OTP_LENGTH, 6);
const OTP_EXPIRES_MINUTES = getNumberFromEnv(process.env.ADMIN_OTP_EXPIRES_MINUTES, 5);
const OTP_MAX_VERIFY_ATTEMPTS = getNumberFromEnv(process.env.ADMIN_OTP_MAX_VERIFY_ATTEMPTS, 5);
const OTP_RESEND_COOLDOWN_SECONDS = getNumberFromEnv(process.env.ADMIN_OTP_RESEND_COOLDOWN_SECONDS, 60);
const OTP_LOGIN_LOCK_MINUTES = getNumberFromEnv(process.env.ADMIN_OTP_LOGIN_LOCK_MINUTES, 15);
const LOGIN_TOKEN_EXPIRES_MINUTES = 10;

let otpIndexesReady: Promise<void> | null = null;

type OtpChallengeDoc = {
  _id?: ObjectId;
  email: string;
  codeHash: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: Date;
  resendAvailableAt: Date;
  verifiedAt?: Date;
  loginTokenHash?: string;
  loginTokenExpiresAt?: Date;
  consumedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hashValue = (value: string) => createHash("sha256").update(value).digest("hex");

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const createOtpCode = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(random);
};

const ensureOtpIndexes = async () => {
  if (!otpIndexesReady) {
    otpIndexesReady = (async () => {
      const db = await getDatabase();
      const collection = db.collection<OtpChallengeDoc>(ADMIN_OTP_COLLECTION);

      await Promise.all([
        collection.createIndex({ email: 1, createdAt: -1 }, { name: "otp_email_created" }),
        collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "otp_expires_ttl" }),
        collection.createIndex({ loginTokenExpiresAt: 1 }, { expireAfterSeconds: 0, sparse: true, name: "otp_login_token_ttl" }),
      ]);
    })();
  }

  await otpIndexesReady;
};

export const createAdminOtpChallenge = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  const db = await getDatabase();
  const collection = db.collection<OtpChallengeDoc>(ADMIN_OTP_COLLECTION);

  await ensureOtpIndexes();

  const now = new Date();
  await collection.deleteMany({ expiresAt: { $lte: now } });
  const existing = await collection.findOne(
    {
      email: normalizedEmail,
      verifiedAt: { $exists: false },
      consumedAt: { $exists: false },
      expiresAt: { $gt: now },
    },
    { sort: { createdAt: -1 } },
  );

  if (existing && existing.resendAvailableAt > now) {
    const waitSeconds = Math.ceil((existing.resendAvailableAt.getTime() - now.getTime()) / 1000);
    return {
      ok: false as const,
      waitSeconds,
    };
  }

  const code = createOtpCode();
  const codeHash = hashValue(code);
  const expiresAt = new Date(now.getTime() + OTP_EXPIRES_MINUTES * 60 * 1000);
  const resendAvailableAt = new Date(now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000);

  const doc: OtpChallengeDoc = {
    email: normalizedEmail,
    codeHash,
    attempts: 0,
    maxAttempts: OTP_MAX_VERIFY_ATTEMPTS,
    expiresAt,
    resendAvailableAt,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(doc);

  return {
    ok: true as const,
    challengeId: result.insertedId.toString(),
    code,
    expiresInMinutes: OTP_EXPIRES_MINUTES,
  };
};

export const verifyAdminOtpCode = async (email: string, challengeId: string, code: string) => {
  const normalizedEmail = normalizeEmail(email);

  if (!ObjectId.isValid(challengeId)) {
    return { ok: false as const, reason: "invalid" as const };
  }

  const db = await getDatabase();
  const collection = db.collection<OtpChallengeDoc>(ADMIN_OTP_COLLECTION);

  await ensureOtpIndexes();
  const now = new Date();

  const existing = await collection.findOne({
    _id: new ObjectId(challengeId),
    email: normalizedEmail,
  });

  if (!existing) {
    return { ok: false as const, reason: "invalid" as const };
  }

  if (existing.consumedAt) {
    return { ok: false as const, reason: "used" as const };
  }

  if (existing.verifiedAt) {
    return { ok: false as const, reason: "used" as const };
  }

  if (existing.expiresAt <= now) {
    return { ok: false as const, reason: "expired" as const };
  }

  if (existing.attempts >= existing.maxAttempts) {
    return { ok: false as const, reason: "locked" as const };
  }

  const isCodeMatch = safeEqual(existing.codeHash, hashValue(code.trim()));

  if (!isCodeMatch) {
    await collection.updateOne(
      { _id: existing._id },
      {
        $inc: { attempts: 1 },
        $set: { updatedAt: now },
      },
    );

    return { ok: false as const, reason: "invalid" as const };
  }

  const loginToken = randomBytes(32).toString("hex");
  const loginTokenHash = hashValue(loginToken);
  const loginTokenExpiresAt = new Date(now.getTime() + LOGIN_TOKEN_EXPIRES_MINUTES * 60 * 1000);

  await collection.updateOne(
    { _id: existing._id },
    {
      $set: {
        verifiedAt: now,
        loginTokenHash,
        loginTokenExpiresAt,
        updatedAt: now,
      },
    },
  );

  return {
    ok: true as const,
    loginToken,
    loginTokenExpiresInMinutes: LOGIN_TOKEN_EXPIRES_MINUTES,
  };
};

export const consumeAdminLoginToken = async (email: string, loginToken: string) => {
  const normalizedEmail = normalizeEmail(email);
  const db = await getDatabase();
  const collection = db.collection<OtpChallengeDoc>(ADMIN_OTP_COLLECTION);

  await ensureOtpIndexes();
  const now = new Date();
  const loginTokenHash = hashValue(loginToken.trim());

  const challenge = await collection.findOne(
    {
      email: normalizedEmail,
      verifiedAt: { $exists: true },
      consumedAt: { $exists: false },
      loginTokenExpiresAt: { $gt: now },
    },
    { sort: { verifiedAt: -1 } },
  );

  if (!challenge || !challenge.loginTokenHash) {
    return false;
  }

  const isTokenMatch = safeEqual(challenge.loginTokenHash, loginTokenHash);

  if (!isTokenMatch) {
    return false;
  }

  await collection.updateOne(
    { _id: challenge._id },
    {
      $set: {
        consumedAt: now,
        updatedAt: now,
      },
    },
  );

  return true;
};

export const getAdminLoginLockMinutes = () => OTP_LOGIN_LOCK_MINUTES;
