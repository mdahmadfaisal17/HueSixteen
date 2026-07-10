import ServicePage from "@/components/Service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore branding, brand identity, social media design, event branding, and premium 3D mockup services tailored to help businesses grow.",
};

export default function Service() {
  return <ServicePage />;
}
