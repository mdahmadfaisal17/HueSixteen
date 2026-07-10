"use client";
import { innovationList } from "@/app/api/data";
import Link from "next/link";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Innovation() {
    const ref = useRef(null);
    const inView = useInView(ref);

    const bottomAnimation = (index: any) => ({
        initial: { y: "25%", opacity: 0 },
        animate: inView ? { y: 0, opacity: 1 } : { y: "25%", opacity: 0 },
        transition: { duration: 0.3, delay: 0.3 + index * 0.3 },
    });
    return (
        <section id="services">
            <div ref={ref} className="2xl:py-20 py-11">
                <div className="container">
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col justify-center items-center gap-10 lg:gap-16">
                            <motion.div {...bottomAnimation(1)} className="max-w-2xl text-center mx-auto">
                                <h2>
                                    <span className="block">From Strategy</span>
                                    <span className="block dark:opacity-70">To Visual Impact</span>
                                </h2>
                            </motion.div>
                            <motion.div {...bottomAnimation(2)} className="grid auto-rows-max grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 w-full">
                                {innovationList.map((items, index) => {
                                    return (
                                        <div key={index} className={`${items.bg_color} bg-opacity-20 dark:opacity-100 flex flex-col p-8 rounded-2xl gap-6 lg:gap-9 `} >
                                            <div className={`${items.txt_color}`}>
                                                <span
                                                    aria-hidden="true"
                                                    className="inline-block h-10 w-10 bg-current"
                                                    style={{
                                                        WebkitMaskImage: `url(${items.image})`,
                                                        maskImage: `url(${items.image})`,
                                                        WebkitMaskRepeat: "no-repeat",
                                                        maskRepeat: "no-repeat",
                                                        WebkitMaskPosition: "center",
                                                        maskPosition: "center",
                                                        WebkitMaskSize: "contain",
                                                        maskSize: "contain",
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h5 className={`${items.txt_color}`}>
                                                    {items.title.split("\n").map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </h5>
                                            </div>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        </div>
                        <motion.div {...bottomAnimation(3)} className="flex flex-col gap-4 xl:flex xl:flex-row bg-dark_black items-center justify-between dark:bg-white dark:bg-opacity-5 py-8 px-7 sm:px-12 rounded-3xl w-full">
                            <h4 className="text-white text-center xl:text-left">Ready to Elevate<br /> Your Brand Identity?</h4>
                            <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
                                <Link href="/contact" className='group inline-flex w-fit sm:w-auto min-w-[180px] sm:min-w-[220px] items-center justify-between gap-4 text-dark_black font-medium bg-white rounded-full py-2 pl-5 pr-3 border border-white dark:border-opacity-50 transition-colors duration-500 ease-out hover:bg-purple_blue hover:text-white hover:border-transparent'>
                                    <span className="flex-1 whitespace-nowrap text-left leading-none">Let&apos;s Talk</span>
                                    <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-dark_black transition-colors duration-500 ease-out group-hover:bg-white">
                                        <svg width="12" height="12" viewBox="0 0 247.36 247.36" xmlns="http://www.w3.org/2000/svg" className="text-white transition-colors duration-500 ease-out group-hover:text-dark_black">
                                            <path fill="currentColor" d="M240.95,6.41h0c-7.35-7.35-18.82-8.51-27.52-2.82-27.48,17.97-89.98,48.89-146.32,5.27-7.54-5.83-18.2-5.28-24.94,1.46h0c-7.95,7.95-7.14,21.01,1.63,28.04,35.75,28.64,73.06,35.83,106.68,32.04L5.48,215.41c-7.31,7.31-7.31,19.16,0,26.47h0c7.31,7.31,19.16,7.31,26.47,0L176.96,96.87c-3.78,33.62,3.4,70.93,32.04,106.68,7.03,8.78,20.09,9.58,28.04,1.63h0c6.74-6.74,7.29-17.4,1.46-24.94-43.61-56.34-12.69-118.84,5.27-146.32,5.69-8.69,4.52-20.17-2.82-27.52h0Z" />
                                        </svg>
                                    </div>
                                </Link>
                                <Link href="/#work" className='group inline-flex w-fit sm:w-auto min-w-[180px] sm:min-w-[220px] items-center justify-between gap-4 border border-white dark:border-opacity-50 text-white font-medium bg-transparent rounded-full py-2 pl-5 pr-3 transition-colors duration-500 ease-out hover:bg-purple_blue hover:text-white hover:border-transparent'>
                                    <span className="flex-1 whitespace-nowrap text-left leading-none">Explore Services</span>
                                    <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-white transition-colors duration-500 ease-out group-hover:bg-white">
                                        <svg width="12" height="12" viewBox="0 0 247.36 247.36" xmlns="http://www.w3.org/2000/svg" className="text-dark_black transition-colors duration-500 ease-out group-hover:text-dark_black">
                                            <path fill="currentColor" d="M240.95,6.41h0c-7.35-7.35-18.82-8.51-27.52-2.82-27.48,17.97-89.98,48.89-146.32,5.27-7.54-5.83-18.2-5.28-24.94,1.46h0c-7.95,7.95-7.14,21.01,1.63,28.04,35.75,28.64,73.06,35.83,106.68,32.04L5.48,215.41c-7.31,7.31-7.31,19.16,0,26.47h0c7.31,7.31,19.16,7.31,26.47,0L176.96,96.87c-3.78,33.62,3.4,70.93,32.04,106.68,7.03,8.78,20.09,9.58,28.04,1.63h0c6.74-6.74,7.29-17.4,1.46-24.94-43.61-56.34-12.69-118.84,5.27-146.32,5.69-8.69,4.52-20.17-2.82-27.52h0Z" />
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section >
    );
}

export default Innovation;
