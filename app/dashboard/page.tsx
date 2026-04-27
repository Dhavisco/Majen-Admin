"use client";

import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import MetricCard from '../components/MetricCard/MetricCard';
// import RevenueChart from '../components/RevenueChart/RevenueChart';
// import ProgressBar from '../components/ProgressBar/ProgressBar';
import VerificationTable from '../components/VerificationTable/VerificationTable';
import ActivityList from '../components/ActivityList/ActivityList';
import LiveDate from '../components/LiveDate';
import { IoWarningOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useDashboard } from '@/hooks/dashboard/useDashboard';


const DashboardPage: React.FC = () => {
    const { metrics, verifications, activities, pendingCounts } = useDashboard();



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
                            <div className='font-semibold text-[#92400E] text-sm lg:text-base'>{pendingCounts.pendingVerifications} pending designer verifications · {pendingCounts.pendingProducts} products awaiting review</div>
                            <div className='text-xs lg:text-sm text-[#A16207]'>These require action before end of day to avoid affecting seller operations</div>
                        </div>
                    </div>

                    <div className='flex flex-row items-center justify-end gap-3 text-xs md:text-sm font-medium'>
                        <Link
                            href="/dashboard/designers"
                            className="bg-[#D97706] hover:bg-[#B45309] border border-[#B45309] cursor-pointer text-white! px-3 py-1.5 lg:h-9 rounded-[10px] inline-flex items-center"
                        >
                            Review designers
                        </Link>
                        <Link
                            href="/dashboard/products"
                            className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E]! border border-[#FDE68A] cursor-pointer px-3 py-1.5 lg:h-9 rounded-[10px] inline-flex items-center"
                        >
                            Review products
                        </Link>
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

            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
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
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <VerificationTable data={verifications} />
                <ActivityList activities={activities} />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;