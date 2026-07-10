"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Solutions() {
    const ref = useRef(null);
    const inView = useInView(ref);

    const bottomAnimation = {
        initial: { y: "5%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 1, delay: 0.8 },
      };

    return (
        <section suppressHydrationWarning>
            <div  className="2xl:py-20 py-11">
                <div className="container">
                    <div ref={ref} className="py-16 md:py-28 px-6 border border-dark_black border-opacity-10 rounded-3xl bg-[linear-gradient(90deg,#5A36E8_0%,#F0EDFF_24%,#FFFFFF_48%,#FFFFFF_65.77%,#FCEE28_100%)] backdrop-blur-[200px]">
                        <motion.div {...bottomAnimation} className="flex flex-col gap-6 items-center max-w-2xl mx-auto">
                            <div className="flex flex-col gap-3 items-center text-center">
                                <h2 className="text-3xl md:text-5xl">
                                    <span className="block">Let's Create Together</span>
                                    <span className="block">A Brand People Remember</span>
                                </h2>
                                <p className="">Whether you're building a new brand or refreshing an existing one, we're here to create thoughtful design that helps your business stand out with confidence.</p>
                            </div>
                            <Link href="/contact" className='group w-fit text-white font-medium bg-dark_black rounded-full flex items-center gap-4 py-2 pl-5 pr-2 border border-dark_black transition-colors duration-500 ease-out hover:bg-transparent hover:text-dark_black'>
                                <span>Let's Talk</span>
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white transition-colors duration-500 ease-out group-hover:bg-dark_black">
                                    <Image
                                        src="/images/svgs/arrow-up-right.svg"
                                        alt="Arrow up right"
                                        width={12}
                                        height={12}
                                        className="invert transition-all duration-500 ease-out group-hover:invert-0"
                                    />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Solutions;
