import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const normalizeOrigin = (value: string) => value.replace(/\/$/, "").toLowerCase();
const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const requireSameOrigin = (request: NextRequest) => {
  const origin = request.headers.get("origin");

  if (!origin) {
    if (unsafeMethods.has(request.method.toUpperCase())) {
      return NextResponse.json({ message: "Missing origin." }, { status: 403 });
    }

    return null;
  }

  const requestOrigin = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const allowedOrigins = [requestOrigin, process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_APP_URL]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .map(normalizeOrigin);

  if (allowedOrigins.includes(normalizeOrigin(origin))) {
    return null;
  }

  return NextResponse.json({ message: "Forbidden origin." }, { status: 403 });
};
