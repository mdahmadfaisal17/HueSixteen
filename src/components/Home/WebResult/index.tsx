"use client";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function WebResult() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const animate = mounted && inView;
    return (
        <section id="aboutus">
            <div className="2xl:py-20 py-11">
                <div className="container">
                    <div className="flex flex-col  lg:gap-16 gap-5">
                        <div className="flex flex-col items-center justify-center text-center gap-3">
                            <h2 className="max-w-6xl">
                                Blending strategy with creative design to build memorable brands that connect, inspire, and stand out.
                            </h2>
                        </div>
                        <div className="flex-col md:flex md:flex-row   justify-center items-center text-center">
                            <div className="relative 2xl:px-24 px-16 md:py-8 py-4">
                                <h2 ref={ref} className="2xl:text-9xl md:text-7xl text-5xl">
                                    <span className="inline-flex items-center gap-2 leading-none">
                                        {animate ? <CountUp start={0} end={40} duration={3} /> : "0"}
                                        <span className="text-purple_blue">+</span>
                                    </span>
                                </h2>
                                <p className="mt-2 opacity-60">Brands Served</p>
                                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-28 w-px bg-dark_black bg-opacity-10" />
                            </div>
                            <div className="relative 2xl:px-24 px-16 md:py-8 py-4">
                                <h2 className="2xl:text-9xl md:text-7xl text-5xl">
                                    <span className="inline-flex items-center gap-2 leading-none">
                                        {animate ? <CountUp start={0} end={70} duration={3} /> : "0"}
                                        <span className="text-purple_blue">+</span>
                                    </span>
                                </h2>
                                <p className="mt-2 opacity-60">Projects Delivered</p>
                                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-28 w-px bg-dark_black bg-opacity-10" />
                            </div>
                            <div className="relative 2xl:px-24 px-16 md:py-8 py-4">
                                <h2 className="2xl:text-9xl md:text-7xl text-5xl">
                                    <span className="inline-flex items-center gap-2 leading-none">
                                        {animate ? <CountUp start={0} end={99} duration={3} /> : "0"}
                                        <span className="text-purple_blue">%</span>
                                    </span>
                                </h2>
                                <p className="mt-2 opacity-60">Client Satisfaction</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default WebResult;
