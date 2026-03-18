// components/DashboardLayout/DashboardLayout.tsx
'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MobileNav from '../MobileNav/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebarStore();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar – hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar />
            </div>


            {/* Content wrapper – shifts with sidebar width */}
            <div
                className={`${isCollapsed ? 'md:ml-20' : 'md:ml-54'} 
          flex-1 flex flex-col transition-all duration-300 ease-in-out md:ml-0
        `}
            // style={{
            //     // Only apply margin on desktop
            //     marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
            //         ? (isCollapsed ? '5rem' : '13.5rem')
            //         : '0px',
            // }}
            >
                {/* Fixed header – stays at top of this column */}
                <div className="sticky top-0 z-20 bg-white shadow-sm">
                    <Header />
                </div>

                {/* Scrollable main content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
                    {children}
                </main>

                {/* Mobile bottom navigation – only on small screens */}
                <div className="md:hidden">
                    <MobileNav />
                </div>

            </div>
        </div>
    );
}