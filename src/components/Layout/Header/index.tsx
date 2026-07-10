"use client";
import Link from 'next/link';
import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import HeaderLink from '../Header/Navigation/HeaderLink';
import { headerData } from "../Header/Navigation/Menudata";
import Logo from '../Header/Logo';
import MobileHeader from './Navigation/MobileHeader';
import Image from 'next/image';
import { usePathname } from "next/navigation";

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sticky, setSticky] = useState(false);
    const pathname = usePathname();

    const handleScroll = () => {
        setSticky(window.scrollY >= 80);
    };


    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    return (
        <>
            <header className={`fixed top-0 z-50 w-full`}>
                <div className='container p-3'>
                    <nav className={`flex items-center py-3 px-4 justify-between ${sticky ? " rounded-full shadow bg-white" : null} `}>
                        <Link href="/" className='flex items-center gap-2'>
                            <div className='scale-90 origin-left'>
                                <Logo withLink={false} />
                            </div>
                            <span className='text-2xl font-semibold tracking-tight text-dark_black'>Hue Sixteen</span>
                        </Link>
                        <div className='hidden lg:flex bg-dark_black bg-opacity-5 rounded-3xl py-3 px-1'>
                            <ul className="flex gap-0 2xl:gap-1.5">
                                {headerData.map((item) => (
                                    <HeaderLink key={item.href} item={item} />
                                ))}
                            </ul>
                        </div>
                        <div className='flex items-center gap-1 xl:gap-4'>
                            





<div className='flex items-center gap-2'>
        <Link
                href="/contact"
                className="hidden lg:flex relative items-center gap-2 text-white px-5 py-2 bg-dark_black rounded-full border border-transparent transition-colors duration-500 ease-[cubic-bezier(.22,.8,.3,1)] hover:bg-purple_blue"
        >
            <span>Let&apos;s Talk</span>
            <Image src="/images/svgs/arrow-up-right.svg" alt="Arrow up right" width={12} height={12} />
        </Link>
</div>


                            <div className='hidden max-lg:flex'>
                                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M4.5 12h15m-15 5.77h15M4.5 6.23h15" /></svg>
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* ------------------------- Mobile sidebar starts ------------------------- */}
                {
                    sidebarOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40" />
                    )
                }
                <div
                    className={`lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${sidebarOpen ? "translate-x-0" : "translate-x-full"} z-50`}
                >
                    <div className='flex items-center justify-between p-4'>
                        <h2 className="text-lg font-bold">Menu</h2>
                        <button onClick={() => setSidebarOpen(false)} aria-label="Close mobile menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className='p-4'>
                        <ul className="flex flex-col">
                            {headerData.map((item) => (
                                <MobileHeader
                                    key={item.href}
                                    item={item}
                                    onItemClick={() => setSidebarOpen(false)}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
