'use client';

import React from 'react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import {
    FaHome,
    FaUsers,
    FaShoppingCart,
    FaBoxOpen,
    FaChartLine,
    FaMoneyBillWave,
    FaCog,
    FaUser,
} from 'react-icons/fa';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';

const Sidebar: React.FC = () => {
    const { isCollapsed, toggleCollapse } = useSidebarStore();
    const router = useRouter();
    const pathname = usePathname();

    const menuSections = [
        {
            title: 'Main',
            items: [{ name: 'Dashboard', icon: <FaHome />, route: '/dashboard', badge: null }],
        },
        {
            title: 'People',
            items: [
                { name: 'Designers', icon: <FaUser />, route: '/dashboard/designers', badge: 4 },
                { name: 'Clients', icon: <FaUsers />, route: '/dashboard/clients', badge: null },
            ],
        },
        {
            title: 'Commerce',
            items: [
                { name: 'Products', icon: <FaBoxOpen />, route: '/dashboard/products', badge: 12 },
                { name: 'Orders', icon: <FaShoppingCart />, route: '/dashboard/orders', badge: null },
            ],
        },
        {
            title: 'Operations',
            items: [
                { name: 'Reports', icon: <FaChartLine />, route: '/dashboard/reports', badge: 5 },
                { name: 'Financials', icon: <FaMoneyBillWave />, route: '/dashboard/financials', badge: null },
            ],
        },
        {
            title: 'System',
            items: [{ name: 'Settings', icon: <FaCog />, route: '/dashboard/settings', badge: null }],
        },
    ];

    return (
        <div
            className={`bg-[#1A0089] text-white h-screen flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-54'
                } fixed top-0 left-0 transition-all duration-300 ease-in-out overflow-hidden`}
        >

            <div className='flex flex-col image-nav gap-2'>
                <div className={`${isCollapsed ? 'justify-center' : ''} flex items-center mt-2 mb-2`}>
                    <Image src="/majenIcon.png" alt="Majen" width={40} height={40} priority className="rounded" />
                    {!isCollapsed && <span className="ml-2 font-bold">MAJEN</span>}
                </div>

                {/* Navigation */}
                <ul className="flex flex-col gap-3">
                    {menuSections.map((section) => (
                        <div key={section.title} className="mb-2">
                            {!isCollapsed && (
                                <h3 className="text-xs font-bold px-4 uppercase text-gray-300">{section.title}</h3>
                            )}
                            {section.items.map((item) => {
                                const isActive = pathname === item.route;
                                return (
                                    <li
                                        key={item.name}
                                        className={`flex items-center px-3 my-0.5 cursor-pointer 
                    ${isActive ? 'border-l-3 border-white' : ''}
                  `}
                                        onClick={() => router.push(item.route)}
                                    >
                                        <div className={`flex w-full items-center ${isActive ? 'bg-[#ffffff24] rounded-sm p-2' : 'hover:bg-[#ffffff18] rounded-sm p-2'}`}>
                                            <span className={`${isCollapsed ? 'mx-auto' : 'mr-4'} ${isActive ? 'text-white' : ''}`}>
                                                {item.icon}
                                            </span>
                                            {!isCollapsed && (
                                                <span className="flex justify-between w-full">
                                                    <span className={`${isActive ? 'font-semibold text-white' : ''}`}>{item.name}</span>
                                                    {item.badge && (
                                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>
                                                    )}
                                                </span>
                                            )}

                                        </div>


                                    </li>
                                );
                            })}
                        </div>
                    ))}
                </ul>
            </div>
            {/* Logo */}



            {/* Footer with toggle + user details */}
            <div className="p-4">
                {/* Toggle Button */}
                <div className="flex justify-center mb-4">
                    <button className="focus:outline-none cursor-pointer" onClick={toggleCollapse}>
                        {isCollapsed ? (
                            <GoSidebarCollapse className="text-white w-6 h-6" />
                        ) : (
                            <GoSidebarExpand className="text-white w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* User Details */}
                <div className="flex items-center cursor-pointer bg-blue-900 rounded-lg p-2">
                    <div className="bg-white text-blue-900 text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                        SA
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3">
                            <div className="font-semibold text-sm">Super Admin</div>
                            <div className="text-xs text-gray-300">Full access</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
