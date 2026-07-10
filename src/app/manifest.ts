import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hue Sixteen",
    short_name: "Hue Sixteen",
    description: "Hue Sixteen creates thoughtful brand identity, social media, event branding, and mockup design systems for modern businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0c0b10",
    icons: [
      {
        src: "/images/logo/Logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}