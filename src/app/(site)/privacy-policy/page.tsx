import PrivacyPolicy from "@/components/PrivacyPolicy";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Privacy Policy | Hue Sixteen",
    description: "Read how Hue Sixteen collects, uses, and protects your personal information.",
};

export default function Page() {
    return (
        <main>
            <PrivacyPolicy/>
        </main>
    );
};
