import PortfolioPage from "@/components/Portfolio";
import type { Metadata } from "next";
import { getPortfolios } from "@/lib/server/contentRepository";
import type { onlinePresence } from "@/types/menu";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse selected branding, identity design, social media, event branding, and 3D mockup projects created for businesses around the world.",
};

export default async function Portfolio() {
  const data = await getPortfolios();

  const initialProjects: onlinePresence[] = data
    .filter(
      (item): item is {
        image: string;
        title: string;
        tag?: string[];
        category?: string;
        link?: string;
        projectLink?: string;
      } =>
        typeof item.image === "string" &&
        typeof item.title === "string",
    )
    .map((item) => ({
      image: item.image,
      title: item.title,
      tag: Array.isArray(item.tag) && item.tag.length > 0 ? item.tag : [item.category ?? "General"],
      link: item.link || item.projectLink || "#",
    }));

  return <PortfolioPage initialProjects={initialProjects} />;
}
