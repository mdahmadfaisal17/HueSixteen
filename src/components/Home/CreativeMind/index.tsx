"use client";
import { creativeMindList } from "@/app/api/data";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

function CreativeMind() {
    const ref = useRef(null);
    const inView = useInView(ref);

    const bottomAnimation = (index: any) => ({
        initial: { y: "5%", opacity: 0 },
        animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
        transition: { duration: 0.4, delay: 0.4 + index * 0.3 },
    });
    return (
        <section id="team">
            <div ref={ref} className="2xl:py-20 py-11">
                <div className="container">
                    <div className="flex flex-col justify-center items-center gap-10 md:gap-20">
                        <div className="max-w-2xl text-center mx-auto">
                            <motion.div {...bottomAnimation(-1)}>
                                <h2>
                                    <span className="block">Behind Every</span>
                                    <span className="block dark:opacity-70">Memorable Brand Experience</span>
                                </h2>
                            </motion.div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                            {creativeMindList.map((items, index) => {
                                return (
                                    <motion.div {...bottomAnimation(index)} key={index}>
                                        <div key={index} className="group flex flex-col gap-6 items-center justify-center max-w-80">
                                            <div className="group-hover:grayscale">
                                                <Image src={items.image} alt={items.name} width={625} height={410} className="rounded-2xl" unoptimized={true} />
                                            </div>
                                            <div className="flex flex-col gap-4 items-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <p className="text-dark_black font-medium">{items.name}</p>
                                                    <p className="opacity-60">{items.position}</p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <Link href={items.behanceLink} className="group">
                                                        <span
                                                            aria-label="Behance"
                                                            className="block h-5 w-5 bg-[#6DA951]"
                                                            style={{
                                                                WebkitMaskImage: "url('/images/home/icon/behance.svg')",
                                                                maskImage: "url('/images/home/icon/behance.svg')",
                                                                WebkitMaskRepeat: "no-repeat",
                                                                maskRepeat: "no-repeat",
                                                                WebkitMaskPosition: "center",
                                                                maskPosition: "center",
                                                                WebkitMaskSize: "contain",
                                                                maskSize: "contain",
                                                            }}
                                                        />
                                                    </Link>
                                                    <Link href={items.linkedinLink} className="group">
                                                        <span
                                                            aria-label="LinkedIn"
                                                            className="block h-5 w-5 bg-[#6DA951]"
                                                            style={{
                                                                WebkitMaskImage: "url('/images/home/icon/linkedin.svg')",
                                                                maskImage: "url('/images/home/icon/linkedin.svg')",
                                                                WebkitMaskRepeat: "no-repeat",
                                                                maskRepeat: "no-repeat",
                                                                WebkitMaskPosition: "center",
                                                                maskPosition: "center",
                                                                WebkitMaskSize: "contain",
                                                                maskSize: "contain",
                                                            }}
                                                        />
                                                    </Link>

                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CreativeMind
