import PricingPage from "@/components/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Explore transparent pricing for branding, identity design, social media design, event branding, and custom creative services.",
};

export default function Pricing() {
  return <PricingPage />;
}
