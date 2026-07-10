import { v2 as cloudinary } from "cloudinary";

const cleanEnvValue = (value: string | undefined) => {
  if (!value) {
    return "";
  }

  return value.trim().replace(/^['\"]|['\"]$/g, "");
};

const ensureCloudinaryConfigured = () => {
  const cloudName = cleanEnvValue(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = cleanEnvValue(process.env.CLOUDINARY_API_KEY);
  const apiSecret = cleanEnvValue(process.env.CLOUDINARY_API_SECRET);

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

type UploadableImage = {
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

export const uploadImageToCloudinary = async (file: UploadableImage, folder: string) => {
  ensureCloudinaryConfigured();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });
};