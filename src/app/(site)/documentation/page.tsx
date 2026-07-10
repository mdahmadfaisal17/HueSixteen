
import { Documentation } from "@/components/Documentation/Documentation";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Documentation | Hue Sixteen",
    description: "Browse Hue Sixteen documentation, guides, policies, and helpful resources.",
};

export default function Page() {
    return (
        <>
        <Documentation/>
        </>
    );
};
