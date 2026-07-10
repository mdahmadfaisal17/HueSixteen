import { Metadata } from "next";
import AboutPage from "@/components/About";

export const metadata: Metadata = {
  title: "About | Hue Sixteen",
  description: "Learn the story behind Hue Sixteen, our mission, vision, values, and the creative team dedicated to building meaningful brands worldwide.",
};

export default function Page() {
  return <AboutPage />;
}
