'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaHome, FaCog, FaBars } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const menuSections = [
        {
            title: 'Main',
            items: [
                { name: 'Dashboard', icon: <FaHome />, route: '/dashboard', badge: null },
            ],
        },
        {
            title: 'People',
            items: [
                { name: 'Designers', icon: <FaHome />, route: '/dashboard/designers', badge: 4 },
                { name: 'Clients', icon: <FaHome />, route: '/dashboard/clients', badge: null },
            ],
        },
        {
            title: 'Commerce',
            items: [
                { name: 'Products', icon: <FaHome />, route: '/dashboard/products', badge: 12 },
                { name: 'Orders', icon: <FaHome />, route: '/dashboard/orders', badge: null },
            ],
        },
        {
            title: 'Operations',
            items: [
                { name: 'Reports', icon: <FaHome />, route: '/dashboard/reports', badge: 5 },
                { name: 'Financials', icon: <FaHome />, route: '/dashboard/financials', badge: null },
            ],
        },
        {
            title: 'System',
            items: [
                { name: 'Settings', icon: <FaCog />, route: '/dashboard/settings', badge: null },
            ],
        },
    ];

    return (
        <div
            className={`bg-blue-600 text-white h-full ${isCollapsed ? 'w-16' : 'w-64'} transition-width duration-300`}
        >
            <button
                className="p-4 focus:outline-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <FaBars />
            </button>
            <ul className="mt-4">
                {menuSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-sm font-bold px-4 py-2 uppercase text-gray-300">
                            {section.title}
                        </h3>
                        {section.items.map((item) => (
                            <li
                                key={item.name}
                                className={`flex items-center p-4 cursor-pointer hover:bg-blue-500 ${pathname === item.route ? 'bg-blue-700' : ''
                                    }`}
                                onClick={() => router.push(item.route)}
                            >
                                <span className="mr-4">{item.icon}</span>
                                {!isCollapsed && (
                                    <span className="flex justify-between w-full">
                                        {item.name}
                                        {item.badge && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </li>
                        ))}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
