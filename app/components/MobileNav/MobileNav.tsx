
// components/MobileNav/MobileNav.tsx
'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    FaUsers, FaShoppingCart, FaBoxOpen,
    FaChartLine, FaMoneyBillWave, FaCog,
    FaUser,
} from 'react-icons/fa';
import { useSidebarStore } from '@/stores/sidebarStore';

const navItems = [
    { name: 'Dashboard', icon: <Image src="/mobileIcon.png" width={26} height={26} alt="Dashboard" />, route: '/dashboard' },
    { name: 'Designers', icon: <FaUser />, route: '/dashboard/designers' },
    { name: 'Clients', icon: <FaUsers />, route: '/dashboard/clients' },
    { name: 'Products', icon: <FaBoxOpen />, route: '/dashboard/products' },
    { name: 'Orders', icon: <FaShoppingCart />, route: '/dashboard/orders' },
    { name: 'Reports', icon: <FaChartLine />, route: '/dashboard/reports' },
    { name: 'Financials', icon: <FaMoneyBillWave />, route: '/dashboard/financials' },
    { name: 'Settings', icon: <FaCog />, route: '/dashboard/settings' },
];

export default function MobileNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { pendingVerifications, pendingProducts } = useSidebarStore();

    const getBadgeCount = (route: string) => {
        if (route === '/dashboard/designers') {
            return pendingVerifications;
        }

        if (route === '/dashboard/products') {
            return pendingProducts;
        }

        return 0;
    };

    return (
        <nav
            className="
        fixed bottom-0 left-0 right-0 z-40
        bg-[#1A0089] text-white
        border-t border-white/10
        flex items-center justify-around
        h-16 shadow-lg
      "
        >
            {navItems.map((item) => {
                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                const badgeCount = getBadgeCount(item.route);

                return (
                    <button
                        key={item.name}
                        onClick={() => router.push(item.route)}
                        className={`
              flex flex-col items-center justify-center flex-1 py-2
              transition-colors
              ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}
            `}
                    >
                        <span className="relative text-2xl mb-1">
                            {item.icon}
                            {badgeCount > 0 ? (
                                <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                                    {badgeCount}
                                </span>
                            ) : null}
                        </span>
                        {/* Optional: tiny label below icon if you want */}
                        {/* <span className="text-[10px]">{item.name}</span> */}
                    </button>
                );
            })}
        </nav>
    );
}