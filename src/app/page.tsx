import { LandingSections } from "@/components/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hue Sixteen | Branding & Creative Agency",
  description: "Hue Sixteen is a branding and creative agency helping businesses build memorable brands through brand identity, social media design, event branding, and premium 3D mockups.",
};


export default function Home() {
  return (
    <main suppressHydrationWarning>
      <LandingSections />
    </main>
  );
}
