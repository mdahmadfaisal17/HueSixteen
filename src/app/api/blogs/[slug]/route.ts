import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteBlogBySlug, getBlogBySlug, getPublishedBlogBySlug, updateBlogBySlug } from "@/lib/server/contentRepository";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { requireSameOrigin } from "@/lib/server/requestGuards";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const scope = request.nextUrl.searchParams.get("scope") || "public";

  if (scope === "admin") {
    const unauthorizedResponse = await requireAdmin(request);

    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }
  }

  try {
    const { slug } = await context.params;
    const blog = scope === "admin" ? await getBlogBySlug(slug) : await getPublishedBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json(blog, {
      headers: {
        "Cache-Control": scope === "admin" ? "private, no-store, max-age=0" : "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch blog." }, { status: 500 });
  }
}

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
    const { slug } = await context.params;
    const payload = await request.json();
    const updated = await updateBlogBySlug(slug, payload);

    if (!updated) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Failed to update blog." }, { status: 500 });
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
    const { slug } = await context.params;
    const deleted = await deleteBlogBySlug(slug);

    if (!deleted) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete blog." }, { status: 500 });
  }
}
