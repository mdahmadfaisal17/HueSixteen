import { NextResponse } from "next/server";
import { verifyAdminOtpCode } from "@/lib/server/adminOtp";
import { requireSameOrigin } from "@/lib/server/requestGuards";
import { takeRateLimit } from "@/lib/server/rateLimit";

export async function POST(request: Request) {
  try {
    const sameOriginResponse = requireSameOrigin(request as import("next/server").NextRequest);

    if (sameOriginResponse) {
      return sameOriginResponse;
    }

    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const challengeId = typeof body?.challengeId === "string" ? body.challengeId.trim() : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (!email || !challengeId || !code) {
      return NextResponse.json({ message: "Email, challenge id, and code are required." }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for") || "unknown";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "unknown";
    const rateLimit = await takeRateLimit({ key: `admin-verify:${clientIp}`, limit: 20, windowMs: 15 * 60 * 1000 });

    if (!rateLimit.ok) {
      return NextResponse.json(
        { message: `Too many attempts. Try again in ${rateLimit.retryAfterSeconds}s.` },
        { status: 429 },
      );
    }

    const result = await verifyAdminOtpCode(email, challengeId, code);

    if (!result.ok) {
      if (result.reason === "expired") {
        return NextResponse.json({ message: "Verification code expired. Request a new code." }, { status: 400 });
      }

      if (result.reason === "locked") {
        return NextResponse.json({ message: "Too many invalid code attempts. Request a new code." }, { status: 429 });
      }

      return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
    }

    return NextResponse.json({
      email,
      loginToken: result.loginToken,
      expiresInMinutes: result.loginTokenExpiresInMinutes,
    });
  } catch {
    return NextResponse.json({ message: "Failed to verify code." }, { status: 500 });
  }
}
