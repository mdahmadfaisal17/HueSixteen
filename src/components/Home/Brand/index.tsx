'use client';
import { brandList } from "@/app/api/data";
import SingleBrand from "./SingleBrand";

function Brand() {
    const loopBrands = [...brandList, ...brandList, ...brandList];

    return (
        <section suppressHydrationWarning>
            <div className="2xl:py-20 py-11">
                <div className="container">
                    <div className="gap-4">
                        <div className="flex justify-center text-center py-4 relative">
                            <p className="relative px-2 opacity-60 md:before:absolute md:before:right-[-150px] md:before:top-1/2 md:before:h-0.5 md:before:w-36 md:before:bg-gradient-to-r md:before:from-gray-800 dark:md:before:from-gray-300 dark:md:before:opacity-100 md:before:opacity-10 md:before:to-transparent md:after:absolute md:after:left-[-150px] md:after:top-1/2 md:after:h-0.5 md:after:w-36 md:after:bg-gradient-to-l md:after:from-gray-800 dark:md:after:from-gray-300 md:after:opacity-10 dark:md:after:opacity-100 md:after:to-transparent">
                                Trusted by 40+ brands across industries.
                            </p>
                        </div>

                        <div className="py-3 Xsm:py-7" suppressHydrationWarning>
                            <div className="brand-marquee overflow-hidden">
                                <div className="brand-marquee-track flex w-max items-center gap-20">
                                    {loopBrands.map((items, index) => (
                                        <SingleBrand key={`top-${items.title}-${index}`} brand={items} />
                                    ))}
                                </div>
                            </div>

                            <div className="brand-marquee brand-marquee-reverse mt-8 overflow-hidden">
                                <div className="brand-marquee-track flex w-max items-center gap-20">
                                    {loopBrands.map((items, index) => (
                                        <SingleBrand key={`bottom-${items.title}-${index}`} brand={items} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .brand-marquee-track {
                    animation: brand-marquee-scroll 30s linear infinite;
                }

                .brand-marquee-reverse .brand-marquee-track {
                    animation-direction: reverse;
                }

                .brand-marquee:hover .brand-marquee-track {
                    animation-play-state: paused;
                }

                .brand-marquee-reverse:hover .brand-marquee-track {
                    animation-play-state: paused;
                }

                @keyframes brand-marquee-scroll {
                    from {
                        transform: translateX(0);
                    }

                    to {
                        transform: translateX(-33.333333%);
                    }
                }
            `}</style>
        </section >
    );
}

export default Brand;
