"use client";

import { startupPlanList } from "@/app/api/data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Subscription() {
    const pricingPills = ["Brand Identity", "Event Branding", "Social Media Design", "Custom Mockups"];
    const [activePill, setActivePill] = useState(pricingPills[0]);

    const planOverrides: Record<string, Record<string, {
        label?: string;
        description: string;
        serviceDetail: string;
        price: string;
        features: string[];
    }>> = {
        "Brand Identity": {
            Starter: {
                description: "For startups and small businesses looking to build a professional brand foundation.",
                serviceDetail: "Custom logo design with essential visual elements to help launch your brand with confidence.",
                price: "$150",
                features: [
                    "Custom Logo Design",
                    "Color Palette",
                    "Typography Selection",
                    "Source Files",
                    "Up to 3 Revisions",
                ],
            },
            Pro: {
                label: "Pro",
                description: "Perfect for businesses that need a complete and consistent professional brand identity.",
                serviceDetail: "A complete brand identity system with guidelines and branded assets for professional growth.",
                price: "$450",
                features: [
                    "Everything in Starter",
                    "Social Media Profile Kit (Up to 4 Platforms)",
                    "Brand Guidelines",
                    "Stationery Design (Up to 5 Items)",
                    "Mockup Presentation",
                    "Source Files",
                    "Up to 5 Revisions",
                ],
            },
        },
        "Event Branding": {
            Starter: {
                description: "Essential branding assets to create a professional and cohesive event experience.",
                serviceDetail: "Essential branding assets to create a professional and cohesive event experience.",
                price: "$200",
                features: [
                    "Event Backdrop Design",
                    "Stage Branding Design",
                    "Roll-Up Banner Design (Up to 2)",
                    "Event ID Card Design",
                    "Social Media Event Post (Up to 3)",
                    "Up to 3 Revisions",
                ],
            },
            Pro: {
                label: "Pro",
                description: "Perfect for events that require a complete and consistent visual presence.",
                serviceDetail: "A complete event branding system designed to deliver a memorable and professional event experience.",
                price: "$600",
                features: [
                    "Everything in Starter",
                    "Event Logo Design",
                    "Invitation Card Design",
                    "Certificate Design",
                    "Social Media Event Post (Up to 10)",
                    "Photo Booth Design",
                    "Placard Design",
                    "Up to 5 Revisions",
                ],
            },
        },
        "Social Media Design": {
            Starter: {
                description: "Ideal for businesses that need consistent and professional social media content.",
                serviceDetail: "Ideal for businesses that need consistent and professional social media content.",
                price: "$150/month",
                features: [
                    "8 Social Media Posts",
                    "Basic Story Designs (Up to 4)",
                    "JPG, PNG Only",
                    "Up to 2 Revisions per Design",
                ],
            },
            Pro: {
                label: "Pro",
                description: "Perfect for brands that need frequent, engaging, and consistent social media content.",
                serviceDetail: "Perfect for brands that need frequent, engaging, and consistent social media content.",
                price: "$350/month",
                features: [
                    "16 Social Media Posts",
                    "Resize for up to 3 platforms",
                    "Story Designs (Up to 8)",
                    "Priority Support",
                    "Source Files (JPG, PNG, PSD)",
                    "Up to 3 Revisions per Design",
                ],
            },
        },
        "Custom Mockups": {
            Starter: {
                description: "Ideal for businesses that need a basic editable mockup for presentations and marketing.",
                serviceDetail: "Ideal for businesses that need a basic editable mockup for presentations and marketing.",
                price: "$150",
                features: [
                    "1 Basic Custom Mockup",
                    "Front View or Back View",
                    "Online Editor Access (2 Months)",
                    "Source Files (PSD)",
                    "Up to 3 Revisions",
                ],
            },
            Pro: {
                label: "Pro",
                description: "Perfect for brands that need premium-quality editable mockups with greater flexibility.",
                serviceDetail: "Perfect for brands that need premium-quality editable mockups with greater flexibility.",
                price: "$350",
                features: [
                    "1 High-Quality Custom Mockup",
                    "Any 2 Views (Front, Back, Side, Angled)",
                    "Online Editor Access (4 Months)",
                    "Source Files (PSD)",
                    "Up to 5 Revisions",
                ],
            },
        },
    };

    const serviceDetails: Record<string, { Starter: string; Pro: string }> = {
        "Brand Identity": {
            Starter: "Logo, color palette, and foundational brand assets for fast launch.",
            Pro: "Full brand system with advanced visual direction and brand governance.",
        },
        "Event Branding": {
            Starter: "Key event visuals, banners, and social announcement assets.",
            Pro: "End-to-end event branding with campaign rollout and production-ready files.",
        },
        "Social Media Design": {
            Starter: "Consistent monthly post designs with basic content direction.",
            Pro: "High-volume social creative with strategic content framework and rapid updates.",
        },
        "Custom Mockups": {
            Starter: "Essential UI mockups for concept validation and stakeholder review.",
            Pro: "Advanced interactive mockups and polished presentation-ready design flows.",
        },
    };

    const filteredPlans = startupPlanList
        .filter((plan) => plan.plan_category.includes(activePill))
        .slice(0, 2);

    return (
        <section id="pricing">
            <div className="2xl:py-20 py-11">
                <div className="container">
                    <div className="flex flex-col gap-10 md:gap-20">
                        <div className="max-w-2xl text-center mx-auto">
                            <h2>
                                <span className="block">Choose The Right Plan</span>
                                <span className="block">For Your Business</span>
                            </h2>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-3">
                            {pricingPills.map((pill) => (
                                <button
                                    key={pill}
                                    type="button"
                                    onClick={() => setActivePill(pill)}
                                    className={`px-5 py-2.5 rounded-full border transition-all duration-300 ${activePill === pill
                                        ? "bg-purple_blue border-purple_blue text-white"
                                        : "bg-transparent border-dark_black border-opacity-20 text-dark_black"
                                        }`}
                                >
                                    {pill}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end -my-8 md:-my-12 p-0">
                            <Link
                                href="/pricing"
                                className="p-0 m-0 leading-none text-dark_black font-medium hover:text-purple_blue transition-colors duration-200"
                            >
                                View Full Pricing
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                            {filteredPlans.map((items, index) => (
                                <div className={`${activePill === "Social Media Design" && items.plan_name === "Starter" ? "bg-paleYellow" : items.plan_bg_color} p-6 md:p-10 rounded-2xl`} key={index}>
                                    {(() => {
                                        const planType = items.plan_name === "Pro" ? "Pro" : "Starter";
                                        const activeOverride = planOverrides[activePill]?.[planType];
                                        const planLabel = activeOverride?.label || items.plan_name;
                                        const planDescription = activeOverride?.description || items.plan_descp;
                                        const planServiceDetail = activeOverride?.serviceDetail || serviceDetails[activePill][planType];
                                        const planPrice = activeOverride?.price || items.plan_price;
                                        const planFeatures = activeOverride?.features || items.plan_feature;
                                        const displayPrice = planPrice.replace(/\/\s*month/gi, "").trim();
                                        const isSocialMediaStarter = activePill === "Social Media Design" && planType === "Starter";
                                        const isStarterPlan = planType === "Starter";
                                        const cardTextColor = isSocialMediaStarter ? "text-dark_black" : `${items.text_color}`;
                                        const cardDescriptionColor = isSocialMediaStarter ? "text-dark_black" : `text-${items.descp_color}`;
                                        const cardBorderColor = isSocialMediaStarter ? "border-dark_black" : items.border_color;

                                        return (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="flex flex-col gap-12 md:pr-6">
                                                        <div className="flex flex-col gap-3">
                                                            <p className="py-2 px-4 bg-dark_black w-fit text-white rounded-full">{planLabel}</p>
                                                            <p className={`${cardDescriptionColor} opacity-60`}>{planDescription}</p>
                                                        </div>
                                                        <div className="flex flex-col gap-3 md:gap-5">
                                                            <h2 className={cardTextColor}>
                                                                {displayPrice}
                                                            </h2>
                                                            <Link
                                                                href="/contact"
                                                                className={`group font-medium rounded-full flex items-center gap-4 py-2 pl-5 pr-2 w-fit border transition-colors duration-500 ease-out ${isStarterPlan
                                                                    ? "bg-dark_black text-white border-dark_black hover:bg-transparent hover:text-dark_black"
                                                                    : "bg-white text-dark_black border-transparent hover:bg-transparent hover:border-white hover:text-white"
                                                                    }`}
                                                            >
                                                                <span>Let's Talk</span>
                                                                <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-500 ease-out ${isStarterPlan ? "bg-white group-hover:bg-dark_black" : "bg-purple_blue group-hover:bg-white"}`}>
                                                                    <Image
                                                                        src="/images/svgs/arrow-up-right.svg"
                                                                        alt="Arrow up right"
                                                                        width={12}
                                                                        height={12}
                                                                        className={`transition-all duration-500 ease-out ${isStarterPlan ? "invert group-hover:invert-0" : "group-hover:invert"}`}
                                                                    />
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className={`flex flex-col gap-4 md:pl-6 md:border-l ${cardBorderColor} border-opacity-10`}>
                                                        <p className={cardTextColor}>
                                                            {activeOverride ? "What's Included" : "Features"}
                                                        </p>
                                                        <ul className="flex flex-col gap-4">
                                                            {planFeatures.map((feature, index) => {
                                                                return (
                                                                    <li key={index} className="flex items-center gap-3">
                                                                        <Image src={items.icon_img} alt="icon" width={20} height={20} />
                                                                        <p className={cardTextColor}>{feature}</p>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            ))}
                        </div>
                        {activePill === "Custom Mockups" && (
                            <div className="-mt-6 md:-mt-12 p-4 rounded-lg">
                                <p className="text-base md:text-lg opacity-90 text-dark_black">
                                    <span className="font-semibold">Note:</span> Additional editor access is available through a monthly subscription after the included access period ends.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Subscription;
