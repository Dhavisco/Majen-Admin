// 'use client';

// import React from 'react';
// import Sidebar from '../Sidebar/Sidebar';
// import Header from '../Header/Header';

// const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     return (
//         <div className="flex h-screen">
//             <div className="w-64 fixed top-0 left-0">
//                 <Sidebar />
//             </div>

//             <div className="flex flex-col flex-1 overflow-y-auto ml-64">
//                 <Header />
//                 <main className="flex-1 p-4 bg-gray-100 mt-1">{children}</main>
//             </div>
//         </div>
//     );
// };

// export default DashboardLayout;

// components/DashboardLayout/DashboardLayout.tsx
'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebarStore();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar – fixed */}
            <Sidebar />

            {/* Content wrapper – shifts with sidebar width */}
            <div
                className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
        `}
                style={{
                    marginLeft: isCollapsed ? '5rem'  /* 80px – w-20 */ : '13.5rem' /* 216px – w-54 */
                }}
            >
                {/* Fixed header – stays at top of this column */}
                <div className="sticky top-0 z-20 bg-white shadow-sm">
                    <Header />
                </div>

                {/* Scrollable main content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}