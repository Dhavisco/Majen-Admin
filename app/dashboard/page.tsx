"use client";

import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import MetricCard from '../components/MetricCard/MetricCard';
import RevenueChart from '../components/RevenueChart/RevenueChart';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import VerificationTable from '../components/VerificationTable/VerificationTable';
import ActivityList from '../components/ActivityList/ActivityList';
import LiveDate from '../components/LiveDate';
import { FaUsers, FaShoppingCart, FaDollarSign, FaUser } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';


const DashboardPage: React.FC = () => {
    const { data: dashboardSummary } = useDashboardSummary();

    const pendingVerifications = dashboardSummary?.pendingVerifications ?? 0;
    const pendingProducts = dashboardSummary?.pendingProducts ?? 0;
    const totalClients = dashboardSummary?.clients.total ?? 0;
    const clientsGrowth = dashboardSummary?.clients.growth ?? 0;
    const totalDesigners = dashboardSummary?.designers.total ?? 0;
    const designersGrowth = dashboardSummary?.designers.growth ?? 0;
    const totalOrders = dashboardSummary?.orders.total ?? 0;
    const ordersGrowth = dashboardSummary?.orders.growth ?? 0;
    const revenueCurrent = dashboardSummary?.revenue.current ?? 0;
    const revenueGrowth = dashboardSummary?.revenue.growth ?? 0;

    const formattedRevenue = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(revenueCurrent);

    const metrics = [
        {
            title: 'Total Designers',
            value: totalDesigners,
            indicator: { type: 'percentage' as const, value: designersGrowth },
            icon: <FaUser />,
            color: 'bg-blue-200',
            route: '/dashboard/designers',
        },
        {
            title: 'Active Clients',
            value: totalClients,
            indicator: { type: 'percentage' as const, value: clientsGrowth },
            icon: <FaUsers />,
            color: 'bg-green-200',
            route: '/dashboard/clients',
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            indicator: { type: 'percentage' as const, value: ordersGrowth },
            icon: <FaShoppingCart />,
            color: 'bg-orange-200',
            route: '/dashboard/orders',
        },
        {
            title: 'Platform Revenue',
            value: formattedRevenue,
            indicator: { type: 'percentage' as const, value: revenueGrowth },
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
                    <p className="text-sm text-gray-500">Here&apos;s what needs your attention today — <LiveDate /></p>
                </div>

                {/* Attention details */}
                <div className='p-4 mt-4 flex flex-col gap-2 md:flex-row justify-between rounded-[10px] bg-[#fde68a23] border-[#FDE68A] border'>
                    <div className='flex flex-row items-center gap-3'>
                        <div className='bg-[#FEF3C7] h-10 py-1 px-1.5 flex justify-center items-center rounded-[10px]'>
                            <IoWarningOutline className='text-[#B45309] h-auto w-6' />
                        </div>
                        <div className='flex flex-col gap-0.5'>
                            <div className='font-semibold text-[#92400E] text-sm lg:text-base'>{pendingVerifications} pending designer verifications · {pendingProducts} products awaiting review</div>
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