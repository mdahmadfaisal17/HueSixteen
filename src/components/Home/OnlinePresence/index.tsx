"use client";
import { onlinePresenceList } from "@/app/api/data";
import type { onlinePresence } from "@/types/menu";
import { fetchPortfoliosCached } from "@/lib/client/portfolioCache";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const featuredSlotOrder = ["Slot 01", "Slot 02", "Slot 03", "Slot 04"];

function OnlinePresence() {
    const [featuredProjects, setFeaturedProjects] = useState<onlinePresence[]>([]);

    useEffect(() => {
        const loadFeaturedProjects = async () => {
            try {
                const data = await fetchPortfoliosCached();

                if (!Array.isArray(data)) {
                    return;
                }

                const mapped: onlinePresence[] = data
                    .filter(
                        (item): item is {
                            featuredSlot: string;
                            image: string;
                            title: string;
                            category?: string;
                            projectLink?: string;
                            link?: string;
                        } =>
                            typeof item.featuredSlot === "string" &&
                            typeof item.image === "string" &&
                            typeof item.title === "string"
                    )
                    .filter((item) => featuredSlotOrder.includes(item.featuredSlot))
                    .sort((first, second) => featuredSlotOrder.indexOf(first.featuredSlot) - featuredSlotOrder.indexOf(second.featuredSlot))
                    .slice(0, 4)
                    .map((item) => ({
                        image: item.image,
                        title: item.title,
                        tag: [item.category ?? "General"],
                        link: item.projectLink || item.link || "#",
                    }));

                setFeaturedProjects(mapped);
            } catch {
                setFeaturedProjects([]);
            }
        };

        loadFeaturedProjects();
    }, []);

    return (
        <section id="work">
            <div className="2xl:py-20 py-11">
                <div className="container">
                    <div className="flex flex-col justify-center items-center gap-10 md:gap-20">
                        <div className="max-w-2xl text-center">
                            <h2>
                                <span className="block">Brands We've</span>
                                <span className="block dark:opacity-70">Helped Transform</span>
                            </h2>
                        </div>
                        <div className="flex justify-end -my-8 md:-my-12 p-0 w-full">
                            <Link
                                href="/#work"
                                className="p-0 m-0 leading-none text-dark_black dark:text-white font-medium hover:text-purple_blue transition-colors duration-200"
                            >
                                View All Work
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
                            {featuredProjects.map((items, index) => {
                                return (
                                    <div key={`${items.title}-${items.image}-${index}`} className="group flex flex-col gap-6 cursor-pointer">
                                        <div className="relative ">
                                            <Image src={items.image} alt={items.title} width={625} height={469} className="rounded-2xl" unoptimized={true} />

                                            {/* Overlay div */}
                                            <Link href={items.link} target="_blank" rel="noopener noreferrer" className="absolute top-0 left-0 bg-black bg-opacity-50 w-full h-full rounded-2xl flex items-center justify-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                                                <span className="flex justify-center items-center w-full">
                                                    <Icon icon="icon-park-solid:circle-right-up" width="50" height="50" style={{ color: '#F0EDFF' }} />
                                                </span>
                                            </Link>
                                        </div>

                                        <div className="flex flex-col items-start gap-4">
                                            <h5 className="group-hover:text-purple_blue">{items.title}</h5>
                                            <div className="flex gap-3">
                                                {items.tag.map((tag, tagIndex) => (
                                                    <p key={`${tag}-${tagIndex}`} className="text-dark_black text-sm border border-dark_black border-opacity-10 dark:border-white dark:border-opacity-50 w-fit py-1.5 px-4 rounded-full hover:bg-dark_black hover:text-white">{tag}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OnlinePresence
