'use client';

import React from 'react';

import {

    FaCheckCircle,
    FaClock,

} from 'react-icons/fa';

import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//     Tabs,
//     TabsList,
//     TabsTrigger
// } from '@/components/ui/tabs';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from '@/components/ui/pagination';

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout';
import MetricCard from '@/app/components/MetricCard/MetricCard';
const ReportPage: React.FC = () => {

    const metrics = [
        {
            title: 'Open reports',
            value: '5',
            indicator: { type: 'text' as const, text: '2 urgent', tone: 'warning' },
            icon: <FaCheckCircle className="w-5 h-5" />,
            color: 'bg-yellow-100 text-yellow-600',
        },
        {
            title: 'Flagged reviews',
            value: '3',
            // indicator: { type: 'percentage' as const, value: 8 },
            icon: <FaClock className="w-5 h-5" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Resolved this month',
            value: '42',
            indicator: { type: 'percentage' as const, value: 8 },
            icon: <FaCheckCircle className="w-5 h-5" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Avg resolution time',
            value: '2.4h',
            // indicator: { type: 'text' as const, text: 'Needs Review', tone: 'warning' },
            icon: <FaClock className="w-5 h-5" />,
            color: 'bg-purple-100 text-purple-600',
        },
        // {
        //     title: 'Rejected',
        //     value: '868',
        //     // indicator: { type: 'text' as const, text: '2 flagged', tone: 'danger' },
        //     icon: <FaBan className="w-5 h-5" />,
        //     color: 'bg-red-100 text-red-600',
        // },
    ] as const;





    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">

                <div className='flex justify-between'>
                    <div>  <h1 className="md:text-xl lg:text-2xl text-lg font-bold tracking-tight">Reports & Moderation</h1>
                        <p className="text-muted-foreground md:text-sm text-xs mt-1">
                            Flagged content, disputes and reported accounts requiring review
                        </p>
                    </div>
                    {/* <div className='flex items-center text-sm md:text-base bg-white px-4 gap-1 rounded-xl'>
                        <FaArrowDownLong className='' />
                        <div>Export</div>
                    </div> */}

                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, i) => (
                        <MetricCard key={i} {...metric} />
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <div className="px-3 py-2 border-b">
                            <h3 className="text-sm md:text-lg font-bold tracking-tight">Open reports</h3>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="text-muted-foreground font-semibold">REPORTER</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">AGAINST</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">TYPE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">ACTION</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {[
                                    { reporter: 'Treasure James', against: 'Joy Akigbe', type: 'Scam' as const },
                                    { reporter: 'Aisha Bello', against: 'Mary Atelier', type: 'Quality' as const },
                                    { reporter: 'Kerry W.', against: 'Liz&Co', type: 'Delay' as const },
                                ].map((item) => {
                                    const typeStyles =
                                        item.type === 'Scam'
                                            ? 'bg-rose-100 text-rose-600'
                                            : item.type === 'Quality'
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'bg-amber-100 text-amber-700';

                                    return (
                                        <TableRow key={`${item.reporter}-${item.type}`}>
                                            <TableCell className="font-medium">{item.reporter}</TableCell>
                                            <TableCell className="font-medium">{item.against}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${typeStyles}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {item.type}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" className="bg-[#1A0089] hover:bg-[#14006b] font-semibold px-4">
                                                    Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="bg-white rounded-xl border overflow-hidden">
                        <div className="px-3 py-2 border-b">
                            <h3 className="text-sm md:text-lg font-bold tracking-tight">Flagged reviews</h3>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="text-muted-foreground font-semibold">REVIEW</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DESIGNER</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">ACTION</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {[
                                    { review: '"Horrible service..."', designer: 'Joy Akigbe' },
                                    { review: '"Fake product..."', designer: 'Mary Atelier' },
                                ].map((item) => (
                                    <TableRow key={`${item.designer}-${item.review}`}>
                                        <TableCell className="italic text-gray-600 font-medium">{item.review}</TableCell>
                                        <TableCell className="font-medium">{item.designer}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold px-4"
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default ReportPage;