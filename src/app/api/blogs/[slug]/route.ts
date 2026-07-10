import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteBlogBySlug, getBlogBySlug, updateBlogBySlug } from "@/lib/server/contentRepository";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { requireSameOrigin } from "@/lib/server/requestGuards";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json(blog);
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
