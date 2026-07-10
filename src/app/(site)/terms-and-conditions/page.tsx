import TermsAndCondition from "@/components/TermsAndCondition";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Terms & Conditions | Hue Sixteen",
    description: "Review the terms and conditions governing the use of Hue Sixteen's website and creative services.",
};

export default function Page() {
    return (
        <main>
            <TermsAndCondition/>
        </main>
    );
};
