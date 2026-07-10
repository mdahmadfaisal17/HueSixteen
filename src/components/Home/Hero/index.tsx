"use client";
import Image from 'next/image';
import Link from 'next/link'
import React, { useRef } from 'react'
import { avatarList } from "@/app/api/data";
import StarRating from '@/components/commonComponent/StarRating';
import { motion } from "framer-motion";

function HeroSection() {
  const ref = useRef(null);

  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 1, delay: 0.8 },
  };

  return (
    <section>
      <div 
              className="relative w-full pt-44 2xl:pb-20 pb-10 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-[#6DA951] before:via-white before:to-yellow_gradient before:opacity-30 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-[#4E29FF] dark:before:via-black dark:before:to-yellow_gradient dark:before:opacity-20 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10"
      >
        <div className="container relative z-10">
          <div ref={ref} className='flex flex-col gap-8'>
            {/* ---------------- heading text --------------- */}
            <motion.div {...bottomAnimation} className='relative flex flex-col text-center items-center gap-4'>
              <h1 className='font-medium w-full'>
                <span className='tracking-tight'>We Build Brands</span> People
                <span className='instrument-font italic font-normal tracking-[-0.03em] dark:opacity-70'> Remember</span>
              </h1>
              <p className='max-w-38 opacity-60'>
                Specializing in brand identity, social media, event branding, and premium 3D mockups to help businesses build a brand people remember.
              </p>
            </motion.div>

            <motion.div {...bottomAnimation} className='flex flex-col items-center justify-center gap-4'>
              <div className='flex flex-col items-center justify-center gap-8 w-full sm:flex-row'>
                {/* ----------- Get started Link -------------- */}
                <Link
                  href="/contact"
                  className="group bg-purple_blue text-white font-medium flex flex-row justify-between items-center py-2 px-5 rounded-full max-w-64 w-full md:py-3 border border-purple_blue transition-all duration-500 ease-in-out hover:bg-transparent hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white">
                  <span className="flex text-start">
                    Let&apos;s Talk
                  </span>
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white transition-all duration-500 ease-in-out group-hover:bg-purple_blue">
                    <svg width="13" height="13" viewBox="0 0 247.36 247.36" className="text-purple_blue transition-all duration-500 ease-in-out group-hover:text-white" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M240.95,6.41h0c-7.35-7.35-18.82-8.51-27.52-2.82-27.48,17.97-89.98,48.89-146.32,5.27-7.54-5.83-18.2-5.28-24.94,1.46h0c-7.95,7.95-7.14,21.01,1.63,28.04,35.75,28.64,73.06,35.83,106.68,32.04L5.48,215.41c-7.31,7.31-7.31,19.16,0,26.47h0c7.31,7.31,19.16,7.31,26.47,0L176.96,96.87c-3.78,33.62,3.4,70.93,32.04,106.68,7.03,8.78,20.09,9.58,28.04,1.63h0c6.74-6.74,7.29-17.4,1.46-24.94-43.61-56.34-12.69-118.84,5.27-146.32,5.69-8.69,4.52-20.17-2.82-27.52h0Z" />
                    </svg>
                  </div>
                </Link>

                {/* --------------- avatar division -------------- */}
                <div className='flex items-center gap-7'>
                  <ul className='avatar flex flex-row items-center'>
                    {avatarList.map((items, index) => (
                      <li key={index} className='-mr-2 z-1 avatar-hover:ml-2'>
                        <Image src={items.image} alt='Image' width={44} height={44} quality={100} className='rounded-full border-2 border-white' unoptimized={true} />
                      </li>
                    ))}
                  </ul>
                  {/* -------------- Star rating division --------------- */}
                  <div className='gap-1 flex flex-col'>
                    <div>
                      <StarRating count={5} color='#FC7035' />
                    </div>
                    <p className='text-sm font-normal opacity-60'>Trusted by 40+ brands</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;

