import NotFound from "@/components/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found | Hue Sixteen",
    description: "The page you're looking for couldn't be found.",
};


const ErrorPage = () => {
    return (
        <NotFound />
    );
};

export default ErrorPage;
