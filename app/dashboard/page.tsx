import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import MetricCard from '../components/MetricCard/MetricCard';
import RevenueChart from '../components/RevenueChart/RevenueChart';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import VerificationTable from '../components/VerificationTable/VerificationTable';
import ActivityList from '../components/ActivityList/ActivityList';
import { FaUsers, FaShoppingCart, FaDollarSign, FaUser } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';
import Link from 'next/link';


const DashboardPage: React.FC = () => {

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const metrics = [
        {
            title: 'Total Designers',
            value: 1000,
            indicator: { type: 'percentage' as const, value: 12 },
            icon: <FaUser />,
            color: 'bg-blue-200',
            route: '/dashboard/designers',
        },
        {
            title: 'Active Clients',
            value: 8420,
            indicator: { type: 'percentage' as const, value: 18 },
            icon: <FaUsers />,
            color: 'bg-green-200',
            route: '/dashboard/clients',
        },
        {
            title: 'Total Orders',
            value: 3241,
            indicator: { type: 'percentage' as const, value: -7 },
            icon: <FaShoppingCart />,
            color: 'bg-orange-200',
            route: '/dashboard/orders',
        },
        {
            title: 'Platform Revenue',
            value: '₦48.2M',
            indicator: { type: 'percentage' as const, value: 22 },
            icon: <FaDollarSign />,
            color: 'bg-purple-200',
            route: '/dashboard/financials',
        },
    ] as const;

    const verifications = [
        { designer: 'Kike Johnson', business: 'Liz&Co', submitted: 'Mar 14', actions: <button className="text-blue-600">Verify</button> },
        { designer: 'Omowaju Ayotunde', business: 'Shop Mora', submitted: 'Mar 15', actions: <button className="text-blue-600">Verify</button> },
    ];

    const activities = [
        { description: 'Yvonne Onyata verified by Admin', time: '2m', status: 'success' },
        { description: 'Ankara Blazer flagged for review', time: '18m', status: 'warning' },
        { description: 'Order #4821 placed — ₦100,000', time: '34m', status: 'success' },
        { description: 'Sarah Martin suspended', time: '1h', status: 'error' },
    ];



    return (
        <DashboardLayout>
            <div className='mb-4'>
                <div>
                    <h1 className="text-xl font-bold">Good morning, Admin 👋</h1>
                    <p className="text-sm text-gray-500">Here&apos;s what needs your attention today — {currentDate}</p>
                </div>

                {/* Attention details */}
                <div className='p-4 mt-4 flex flex-col gap-2 md:flex-row justify-between rounded-[10px] bg-[#fde68a23] border-[#FDE68A] border'>
                    <div className='flex flex-row items-center gap-3'>
                        <div className='bg-[#FEF3C7] h-10 py-1 px-1.5 flex justify-center items-center rounded-[10px]'>
                            <IoWarningOutline className='text-[#B45309] h-auto w-6' />
                        </div>
                        <div className='flex flex-col gap-0.5'>
                            <div className='font-semibold text-[#92400E] text-sm lg:text-base'>4 pending designer verifications · 12 products awaiting review · 1 flagged account</div>
                            <div className='text-xs lg:text-sm text-[#A16207]'>These require action before end of day to avoid affecting seller operations</div>
                        </div>
                    </div>

                    <div className='flex flex-row items-center justify-end gap-3 text-xs md:text-sm'>
                        <button className="bg-[#D97706] hover:bg-[#B45309] border border-[#B45309] cursor-pointer text-white px-3 py-1.5 lg:h-9 rounded-[10px]">Review designers</button>
                        <button className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border border-[#FDE68A] cursor-pointer px-3 py-1.5 lg:h-9 rounded-[10px]">Review products</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric, index) => (
                    <Link
                        key={index}
                        href={metric.route}
                        aria-label={`Open ${metric.title}`}
                        className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A0089] focus-visible:ring-offset-2"
                    >
                        <MetricCard {...metric} />
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <div className='lg:col-span-2'>
                    <RevenueChart />
                </div>

                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Platform Health</h3>
                    <ProgressBar label="Verified Designers" value={50} color="bg-blue-500" />
                    <ProgressBar label="Order Fulfillment" value={87} color="bg-green-500" />
                    <ProgressBar label="Active Products" value={81} color="bg-purple-500" />
                    <ProgressBar label="Client Retention" value={74} color="bg-yellow-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <VerificationTable data={verifications} />
                <ActivityList activities={activities} />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;