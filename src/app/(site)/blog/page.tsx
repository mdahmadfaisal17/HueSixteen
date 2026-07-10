import BlogPage from "@/components/Blog";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Insights",
  description: "Read branding, design, marketing, and creative insights to help your business build a stronger and more memorable brand.",
};

export default function Blog() {
  return <BlogPage />;
}
