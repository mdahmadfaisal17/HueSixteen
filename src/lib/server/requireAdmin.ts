import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/server/authSecret";

export const requireAdmin = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: getAuthSecret(),
  });

  if (token?.role === "admin") {
    return null;
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
};
