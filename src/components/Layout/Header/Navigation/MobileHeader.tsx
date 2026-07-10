

"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { HeaderItem } from '../../../../types/menu';

type MobileHeaderProps = {
    item: HeaderItem;
    onItemClick?: () => void;
};

const MobileHeader: React.FC<MobileHeaderProps> = ({ item, onItemClick }) => {
    const pathname = usePathname();
    const isActive = item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
        <li className="w-full">
            <Link
                href={item.href}
                onClick={onItemClick}
                className={`block w-full rounded-md px-4 py-3 text-base font-medium transition ${
                    isActive
                        ? "bg-[#5e53d6] text-white"
                        : "text-black hover:bg-slate-100 hover:text-black/70"
                }`}
            >
                {item.label}
            </Link>
        </li>
    );
};

export default MobileHeader;
