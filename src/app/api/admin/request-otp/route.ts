import { NextResponse } from "next/server";
import { createAdminOtpChallenge } from "@/lib/server/adminOtp";
import { sendAdminOtpEmail } from "@/lib/server/resend";
import { getClientIp, verifyAdminPassword } from "@/lib/server/adminCredentials";
import { requireSameOrigin } from "@/lib/server/requestGuards";
import { takeRateLimit } from "@/lib/server/rateLimit";

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
};

export async function POST(request: Request) {
  try {
    const sameOriginResponse = requireSameOrigin(request as import("next/server").NextRequest);

    if (sameOriginResponse) {
      return sameOriginResponse;
    }

    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const ip = getClientIp(request);
    const rateLimit = await takeRateLimit({ key: `admin-otp:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 });

    if (!rateLimit.ok) {
      return NextResponse.json(
        { message: `Too many attempts. Try again in ${rateLimit.retryAfterSeconds}s.` },
        { status: 429 },
      );
    }

    const credentialCheck = await verifyAdminPassword({ email, password, ip });

    if (!credentialCheck.ok) {
      const message = credentialCheck.reason === "locked"
        ? "Too many failed attempts. Please wait and try again."
        : "Invalid admin email or password.";

      return NextResponse.json({ message }, { status: 401 });
    }

    const challenge = await createAdminOtpChallenge(credentialCheck.email);

    if (!challenge.ok) {
      return NextResponse.json(
        { message: `Please wait ${challenge.waitSeconds}s before requesting a new code.` },
        { status: 429 },
      );
    }

    await sendAdminOtpEmail({
      to: credentialCheck.email,
      code: challenge.code,
      expiresInMinutes: challenge.expiresInMinutes,
    });

    return NextResponse.json({
      challengeId: challenge.challengeId,
      email: credentialCheck.email,
      maskedEmail: maskEmail(credentialCheck.email),
      expiresInMinutes: challenge.expiresInMinutes,
    });
  } catch {
    return NextResponse.json({ message: "Failed to send verification code." }, { status: 500 });
  }
}
