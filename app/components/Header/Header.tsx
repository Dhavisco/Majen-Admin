import React, { useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { usePathname } from 'next/navigation';

const pageTitleMap: Array<{ route: string; title: string }> = [
    { route: '/dashboard/designers', title: 'Designers' },
    { route: '/dashboard/clients', title: 'Clients' },
    { route: '/dashboard/products', title: 'Products' },
    { route: '/dashboard/orders', title: 'Orders' },
    { route: '/dashboard/reports', title: 'Reports & Moderation' },
    { route: '/dashboard/moderation', title: 'Reports & Moderation' },
    { route: '/dashboard/financials', title: 'Financials' },
    { route: '/dashboard/settings', title: 'Settings' },
    { route: '/dashboard', title: 'Dashboard' },
];

const Header: React.FC = () => {
    const pathname = usePathname();

    const pageTitle = useMemo(() => {
        const matched = pageTitleMap.find(
            (item) => pathname === item.route || pathname.startsWith(item.route + '/')
        );
        return matched?.title ?? 'Dashboard';
    }, [pathname]);

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <div className="text-sm md:text-base font-semibold text-gray-700">
                {pageTitle}
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="border rounded-full px-4 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>

                <div className="flex items-center space-x-2">
                    <IoNotificationsOutline className="text-gray-600 w-5 h-5" />
                    <span className="text-xs bg-[#E4E0F8] flex justify-center items-center h-8 w-8 rounded-full text-[#1A0089] font-bold">
                        SA
                    </span>
                    <span className="text-sm font-medium hidden md:block">Super Admin</span>
                </div>
            </div>
        </header>
    );
};

export default Header;