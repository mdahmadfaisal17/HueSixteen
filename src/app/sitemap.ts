import type { MetadataRoute } from "next";
import { getBlogs, getPortfolios } from "@/lib/server/contentRepository";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://huesixteen.com";

const buildUrl = (path: string) => `${siteUrl}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, portfolios] = await Promise.all([getBlogs(), getPortfolios()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/service",
    "/portfolio",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/pricing",
    "/documentation",
  ].map((path) => ({
    url: buildUrl(path || "/"),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: buildUrl(`/blog/${post.slug}`),
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolios
    .map((item) => item.projectLink || item.link)
    .filter((path): path is string => typeof path === "string" && path.startsWith("/"))
    .map((path) => ({
      url: buildUrl(path),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...blogRoutes, ...portfolioRoutes];
}