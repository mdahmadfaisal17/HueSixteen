import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/Layout/AppShell";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://huesixteen.com";
const siteTitle = "Hue Sixteen";
const siteDescription = "Hue Sixteen is a branding and creative agency helping businesses build memorable brands through brand identity, social media design, event branding, and premium 3D mockups.";
const ogImage = "/images/founder.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  category: "Branding & Creative Agency",
  keywords: [
    "Branding Agency",
    "Creative Agency",
    "Brand Identity Design",
    "Logo Design",
    "Graphic Design",
    "Social Media Design",
    "Event Branding",
    "3D Mockups",
    "Visual Identity",
    "Creative Studio",
    "Bangladesh Branding Agency",
    "Brand Strategy",
    "Design Agency",
  ],
  authors: [{ name: "Abdullah Al Faysal" }],
  creator: "Abdullah Al Faysal",
  publisher: "Hue Sixteen",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/images/logo/Logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/images/logo/Logo.svg"],
    apple: ["/images/logo/Logo.svg"],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Hue Sixteen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
