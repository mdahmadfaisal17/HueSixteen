import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createPortfolio, getPortfolios } from "@/lib/server/contentRepository";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { requireSameOrigin } from "@/lib/server/requestGuards";

export async function GET() {
  try {
    const portfolios = await getPortfolios();
    return NextResponse.json(portfolios, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch portfolios." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sameOriginResponse = requireSameOrigin(request);

  if (sameOriginResponse) {
    return sameOriginResponse;
  }

  const unauthorizedResponse = await requireAdmin(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const payload = await request.json();
    const created = await createPortfolio(payload);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create portfolio item." }, { status: 500 });
  }
}
