
import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Contact | Hue Sixteen",
    description: "Start your next branding project with Hue Sixteen. Contact our team to discuss your ideas and receive a custom proposal.",
};

export default function Page() {
    return (
        <main className="min-h-screen">
            <div className="fixed inset-0 z-50 bg-black/55 p-3 sm:p-6 md:p-10 overflow-y-auto">
                <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white p-4 sm:p-6 md:p-8">
                    <div className="mb-4 flex justify-end">
                        <Link
                            href="/"
                            className="rounded-full border border-black/15 px-3 py-1.5 text-sm hover:bg-black hover:text-white transition-colors"
                        >
                            Close
                        </Link>
                    </div>
                    <ContactForm isPopup />
                </div>
            </div>
        </main>
    );
};
