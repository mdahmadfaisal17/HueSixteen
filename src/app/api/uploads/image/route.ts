import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { uploadImageToCloudinary } from "@/lib/server/cloudinary";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { requireSameOrigin } from "@/lib/server/requestGuards";

const ALLOWED_UPLOAD_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_UPLOAD_FOLDERS = new Set(["huesixteen", "huesixteen/blogs", "huesixteen/portfolios"]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

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
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Image file is required." }, { status: 400 });
    }

    if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ message: "Unsupported image type." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ message: "Image is too large. Max size is 5MB." }, { status: 400 });
    }

    const safeFolder = typeof folder === "string" && ALLOWED_UPLOAD_FOLDERS.has(folder.trim())
      ? folder.trim()
      : "huesixteen";

    const uploadResult = await uploadImageToCloudinary(file, safeFolder);

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch {
    return NextResponse.json({ message: "Failed to upload image." }, { status: 500 });
  }
}