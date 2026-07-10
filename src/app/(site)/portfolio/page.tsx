import PortfolioPage from "@/components/Portfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse selected branding, identity design, social media, event branding, and 3D mockup projects created for businesses around the world.",
};

export default function Portfolio() {
  return <PortfolioPage />;
}
