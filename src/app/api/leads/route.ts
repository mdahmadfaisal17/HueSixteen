import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createLead, getLeads } from "@/lib/server/contentRepository";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { sendLeadAcknowledgementEmail } from "@/lib/server/resend";
import { requireSameOrigin } from "@/lib/server/requestGuards";
import { takeRateLimit } from "@/lib/server/rateLimit";

export async function GET(request: NextRequest) {
  const unauthorizedResponse = await requireAdmin(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ message: "Failed to fetch leads." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sameOriginResponse = requireSameOrigin(request as NextRequest);

    if (sameOriginResponse) {
      return sameOriginResponse;
    }

    const forwardedFor = request.headers.get("x-forwarded-for") || "unknown";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "unknown";
    const rateLimit = await takeRateLimit({ key: `lead:${clientIp}`, limit: 5, windowMs: 10 * 60 * 1000 });

    if (!rateLimit.ok) {
      return NextResponse.json(
        { message: `Too many submissions. Try again in ${rateLimit.retryAfterSeconds}s.` },
        { status: 429 },
      );
    }

    const payload = await request.json();
    const fullName = typeof payload?.fullName === "string" ? payload.fullName.trim() : "";
    const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
    const whatsappNumber = typeof payload?.whatsappNumber === "string" ? payload.whatsappNumber.trim() : "";
    const service = typeof payload?.service === "string" ? payload.service.trim() : "";
    const budget = typeof payload?.budget === "string" ? payload.budget.trim() : "";
    const contactMethod = typeof payload?.contactMethod === "string" ? payload.contactMethod.trim().toLowerCase() : "";
    const projectDescription = typeof payload?.projectDescription === "string" ? payload.projectDescription.trim() : "";

    if (!fullName || fullName.length > 120) {
      return NextResponse.json({ message: "Invalid full name." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    if (!whatsappNumber || whatsappNumber.length > 40) {
      return NextResponse.json({ message: "Invalid WhatsApp number." }, { status: 400 });
    }

    if (!service || service.length > 80) {
      return NextResponse.json({ message: "Invalid service selection." }, { status: 400 });
    }

    if (budget.length > 40) {
      return NextResponse.json({ message: "Invalid budget value." }, { status: 400 });
    }

    if (!["whatsapp", "email"].includes(contactMethod)) {
      return NextResponse.json({ message: "Invalid contact method." }, { status: 400 });
    }

    if (projectDescription.length > 3000) {
      return NextResponse.json({ message: "Project description is too long." }, { status: 400 });
    }

    const created = await createLead(payload);

    let emailSent = false;

    if (email && fullName) {
      try {
        await sendLeadAcknowledgementEmail({
          to: email,
          fullName,
          service,
          budget,
          contactMethod,
        });
        emailSent = true;
      } catch {
        emailSent = false;
      }
    }

    return NextResponse.json({ ...created, emailSent }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create lead." }, { status: 500 });
  }
}
