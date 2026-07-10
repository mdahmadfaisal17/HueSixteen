import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { uploadImageToCloudinary } from "@/lib/server/cloudinary";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { requireSameOrigin } from "@/lib/server/requestGuards";

const ALLOWED_UPLOAD_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_UPLOAD_FOLDERS = new Set(["huesixteen", "huesixteen/blogs", "huesixteen/portfolios"]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type UploadableImage = {
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

const isUploadableImage = (value: unknown): value is UploadableImage => {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "size" in value &&
    "arrayBuffer" in value &&
    typeof (value as { type?: unknown }).type === "string" &&
    typeof (value as { size?: unknown }).size === "number" &&
    typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function"
  );
};

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

    if (!isUploadableImage(file)) {
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
  } catch (error) {
    const nestedMessage =
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      typeof (error as { error?: unknown }).error === "object" &&
      (error as { error?: { message?: unknown } }).error !== null &&
      "message" in ((error as { error?: { message?: unknown } }).error || {})
        ? String((error as { error?: { message?: unknown } }).error?.message || "")
        : "";

    const directMessage = error instanceof Error && error.message ? error.message : "";
    const message = directMessage || nestedMessage || "Failed to upload image.";
    return NextResponse.json({ message }, { status: 500 });
  }
}