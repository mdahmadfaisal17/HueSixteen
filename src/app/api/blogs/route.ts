import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createBlog, getBlogs, getBlogSummaries } from "@/lib/server/contentRepository";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { requireSameOrigin } from "@/lib/server/requestGuards";

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") || "public";

  if (scope === "admin") {
    const unauthorizedResponse = await requireAdmin(request);

    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }
  }

  try {
    if (scope === "admin") {
      const blogs = await getBlogs();
      return NextResponse.json(blogs, {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      });
    }

    const blogs = await getBlogSummaries({ publishedOnly: true });
    return NextResponse.json(blogs, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch blogs." }, { status: 500 });
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
    const created = await createBlog(payload);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create blog." }, { status: 500 });
  }
}
