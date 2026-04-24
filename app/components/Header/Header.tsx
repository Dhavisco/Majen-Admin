'use client';

import React, { useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { designers } from '@/app/dashboard/designers/data';
import { clients } from '@/app/dashboard/clients/data';
import { products } from '@/app/dashboard/products/data';
import { useAuthStore } from '@/stores/authStore';

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
    const user = useAuthStore((state) => state.user);

    const profileContext = useMemo(() => {
        const designerMatch = pathname.match(/^\/dashboard\/designers\/(\d+)$/);
        if (designerMatch) {
            const designer = designers.find((item) => String(item.id) === designerMatch[1]);
            if (!designer) return null;
            return {
                label: 'Designers',
                href: '/dashboard/designers',
                name: designer.name,
            };
        }

        const clientMatch = pathname.match(/^\/dashboard\/clients\/(\d+)$/);
        if (clientMatch) {
            const client = clients.find((item) => String(item.id) === clientMatch[1]);
            if (!client) return null;
            return {
                label: 'Clients',
                href: '/dashboard/clients',
                name: client.name,
            };
        }

        const productMatch = pathname.match(/^\/dashboard\/products\/(\d+)$/);
        if (productMatch) {
            const product = products.find((item) => String(item.id) === productMatch[1]);
            if (!product) return null;
            return {
                label: 'Products',
                href: '/dashboard/products',
                name: product.name,
            };
        }

        return null;
    }, [pathname]);

    const pageTitle = useMemo(() => {
        const matched = pageTitleMap.find(
            (item) => pathname === item.route || pathname.startsWith(item.route + '/')
        );
        return matched?.title ?? 'Dashboard';
    }, [pathname]);

    const userDisplayName = useMemo(() => {
        const firstName = user?.firstName?.trim() ?? '';
        const lastName = user?.lastName?.trim() ?? '';
        const fullName = `${firstName} ${lastName}`.trim();

        if (fullName) {
            return fullName;
        }

        return user?.role?.name ?? 'Admin User';
    }, [user]);

    const roleInitials = useMemo(() => {
        const roleName = user?.role?.name?.trim();

        if (!roleName) {
            return 'AU';
        }

        const initials = roleName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('');

        return initials || 'AU';
    }, [user]);

    return (
        <header className="bg-white shadow px-3 py-2 md:p-4 flex justify-between items-center gap-2">
            {profileContext ? (
                <div className="min-w-0 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                    <Link
                        href={profileContext.href}
                        className="inline-flex shrink-0 items-center rounded-md border px-2 py-1 text-[11px] md:text-xs font-medium hover:bg-muted"
                    >
                        <FaArrowLeft className="mr-1" /> Back
                    </Link>
                    <span className="text-muted-foreground">{profileContext.label}</span>
                    <span className="text-muted-foreground">/</span>

                    <span className="font-medium text-gray-700 truncate max-w-30 sm:max-w-50 md:max-w-none">
                        {profileContext.name}
                    </span>
                </div>
            ) : (
                <div className="text-sm md:text-base font-semibold text-gray-700 truncate">
                    {pageTitle}
                </div>
            )}

            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <button
                    type="button"
                    className="sm:hidden inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                    aria-label="Search"
                >
                    <FaSearch className="text-gray-500" />
                </button>


                <div className="relative hidden sm:block">
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="border rounded-full px-4 py-2 text-xs md:text-sm w-40 md:w-52 lg:w-72 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>

                <div className="flex items-center gap-2">
                    <IoNotificationsOutline className="text-gray-600 w-5 h-5" />

                    <Link href="/dashboard/settings" className='flex items-center gap-1 hover:bg-[#e4e0f87c] p-1 hover:rounded-md cursor-pointer'>
                        <span className="text-xs bg-[#E4E0F8] flex justify-center items-center h-8 w-8 rounded-full text-[#1A0089] font-bold">
                            {roleInitials}
                        </span>
                        <span className="text-sm font-medium hidden md:block">{userDisplayName}</span>
                    </Link>

                </div>
            </div>
        </header>
    );
};

export default Header;