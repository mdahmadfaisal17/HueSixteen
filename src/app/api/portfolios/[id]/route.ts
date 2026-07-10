import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deletePortfolioById, updatePortfolioById } from "@/lib/server/contentRepository";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { requireSameOrigin } from "@/lib/server/requestGuards";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const sameOriginResponse = requireSameOrigin(request);

  if (sameOriginResponse) {
    return sameOriginResponse;
  }

  const unauthorizedResponse = await requireAdmin(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();
    const updated = await updatePortfolioById(id, payload);

    if (!updated) {
      return NextResponse.json({ message: "Portfolio item not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Failed to update portfolio item." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const sameOriginResponse = requireSameOrigin(request);

  if (sameOriginResponse) {
    return sameOriginResponse;
  }

  const unauthorizedResponse = await requireAdmin(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { id } = await context.params;
    const deleted = await deletePortfolioById(id);

    if (!deleted) {
      return NextResponse.json({ message: "Portfolio item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete portfolio item." }, { status: 500 });
  }
}
