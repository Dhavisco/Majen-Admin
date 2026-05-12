"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getOrdersDashboard } from '@/lib/api/orders';

import {
    FaSearch,
    FaFilter,
    FaDownload
} from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout';
import { FaArrowDownLong } from 'react-icons/fa6';

const OrderPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');

    const { data: dashboardData } = useQuery({
        queryKey: ['orders', 'dashboard'],
        queryFn: () => getOrdersDashboard(),
    });

    const records = useMemo(() => dashboardData?.records ?? [], [dashboardData]);

    const orderStats = [
        {
            value: String(dashboardData?.dashboardStats?.deliveredOrders ?? 0),
            label: 'DELIVERED',
            cardClass: 'bg-emerald-50 border-emerald-200',
            valueClass: 'text-emerald-600',
            labelClass: 'text-emerald-700',
        },
        {
            value: String(dashboardData?.dashboardStats?.processingOrders ?? 0),
            label: 'PROCESSING',
            cardClass: 'bg-blue-50 border-blue-200',
            valueClass: 'text-blue-600',
            labelClass: 'text-blue-700',
        },
        {
            value: String(dashboardData?.dashboardStats?.awaitingOrders ?? 0),
            label: 'AWAITING',
            cardClass: 'bg-amber-50 border-amber-200',
            valueClass: 'text-amber-600',
            labelClass: 'text-amber-700',
        },
        {
            value: String(dashboardData?.dashboardStats?.cancelledOrders ?? 0),
            label: 'CANCELLED',
            cardClass: 'bg-red-50 border-red-200',
            valueClass: 'text-red-600',
            labelClass: 'text-red-700',
        },
    ] as const;

    const tabs = [
        { label: 'All', value: 'all', color: 'bg-gray-200 text-gray-700' },
        { label: 'Awaiting', value: 'Awaiting', color: 'bg-yellow-100 text-yellow-700' },
        { label: 'Confirmed', value: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Delivered', value: 'Delivered', color: 'bg-green-100 text-green-700' },
        { label: 'Cancelled', value: 'Cancelled', color: 'bg-red-100 text-red-700' },
    ];

    const counts = useMemo(() => {
        const result: Record<string, number> = { all: records.length };
        records.forEach((record) => {
            const key = record.status === 'PENDING' ? 'Awaiting' : record.status === 'CONFIRMED' ? 'Confirmed' : record.status === 'DELIVERED' ? 'Delivered' : record.status;
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }, [records]);

    const filteredOrders = useMemo(() => {
        if (activeTab === 'all') return records;
        return records.filter((d) => {
            if (activeTab === 'Awaiting') return d.status === 'PENDING';
            if (activeTab === 'Confirmed') return d.status === 'CONFIRMED';
            if (activeTab === 'Delivered') return d.status === 'DELIVERED';
            if (activeTab === 'Cancelled') return d.status === 'CANCELLED';
            return d.status === activeTab.toUpperCase();
        });
    }, [activeTab, records]);

    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase?.() ?? '';
        switch (s) {
            case 'DELIVERED':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Delivered</Badge>;
            case 'CONFIRMED':
                return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Confirmed</Badge>;
            case 'PROCESSING':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
            case 'CANCELLED':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatAmount = (value?: string | number) => {
        const num = typeof value === 'string' ? Number.parseFloat(value) : value ?? 0;
        if (Number.isNaN(Number(num))) return '₦0';
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
            .format(Number(num))
            .replace('NGN', '₦');
    };

    const formatName = (record: { firstName?: string; lastName?: string } | undefined) =>
        [record?.firstName, record?.lastName].filter(Boolean).join(' ').trim() || '—';

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">
                <div className="flex justify-between">
                    <div>
                        <h1 className="md:text-xl lg:text-2xl text-lg font-bold tracking-tight">Order Management</h1>
                        <p className="text-muted-foreground md:text-sm text-xs mt-1">
                            Track and manage all orders across the platform
                        </p>
                    </div>

                    <div className="flex text-sm md:text-base items-center bg-white px-4 gap-1 rounded-xl">
                        <FaArrowDownLong />
                        <div>Export</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {orderStats.map((stat) => (
                        <div
                            key={stat.label}
                            className={['rounded-2xl border p-3', stat.cardClass].join(' ')}
                        >
                            <div className={['text-lg md:text-xl font-extrabold leading-none tracking-tight', stat.valueClass].join(' ')}>
                                {stat.value}
                            </div>
                            <div className={['mt-3 text-sm md:text-base font-semibold tracking-wide', stat.labelClass].join(' ')}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border shadow-sm md:py-2 md:px-4 py-1 px-2">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full rounded-none"
                    >
                        <div className="w-full overflow-x-auto scrollbar-thin max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                            <TabsList
                                className="bg-transparent px-0 border-b h-auto w-max min-w-full justify-start gap-1 flex-nowrap"
                                variant="line"
                            >
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="px-4 text-xs md:text-sm text-muted-foreground data-[state=active]:text-[#1A0089] data-[state=active]:font-semibold data-[state=active]:after:bg-[#1A0089] font-medium cursor-pointer"
                                    >
                                        {tab.label}
                                        <span className={['text-[10px] md:text-[11px] flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full font-medium', tab.color].join(' ')}>
                                            {counts[tab.value] ?? 0}
                                        </span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </Tabs>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-5 w-full mt-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order ID, client or designer..."
                                className="pl-10 bg-white text-xs md:text-sm"
                            />
                        </div>

                        <div className="flex items-center text-muted-foreground font-semibold gap-2">

                            <Button variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
                                <FaFilter className="md:h-4 md:w-4 h-2 w-2" />
                                Filter
                            </Button>

                            <Button variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
                                <FaDownload className="md:h-4 md:w-4 h-2 w-2" />
                                Export
                            </Button>

                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <Table className="text-xs md:text-base">
                            <TableHeader>
                                <TableRow className="text-xs md:text-sm">
                                    <TableHead className="text-muted-foreground font-semibold">DATE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">
                                        ORDER ID
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">PRODUCT</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">CLIENT</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DESIGNER</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">AMOUNT</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">STATUS</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell className="md:text-sm font-semibold text-[11px]">{new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</TableCell>

                                        <TableCell className="group-hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-1 md:gap-3">
                                                <Link
                                                    href={`/dashboard/orders/${order.id}`}
                                                    className="md:text-sm text-[11px] px-1.5 py-0.5 bg-[#F4F4F5] text-[#52525B] rounded-sm border border-[#E4E4E7] hover:border-[#1A0089]/30"
                                                >
                                                    <div>{order.identifier}</div>
                                                </Link>
                                            </div>
                                        </TableCell>

                                        <TableCell className="font-medium md:text-sm text-[11px]">
                                            <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">{order.items?.[0]?.product?.title ?? '—'}</Link>
                                        </TableCell>

                                        <TableCell className="font-medium md:text-sm text-[11px]">
                                            <div>{formatName(order.client)}</div>
                                        </TableCell>

                                        <TableCell className="font-medium md:text-sm text-[11px]">
                                            <div>{formatName(order.creator?.user)}</div>
                                        </TableCell>

                                        <TableCell className="font-medium md:text-sm text-[11px]">{formatAmount(order.price)}</TableCell>

                                        <TableCell className="group-hover:bg-muted/50 transition-colors">
                                            <div className="flex gap-2 whitespace-nowrap">{getStatusBadge(order.status)}</div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/orders/${order.id}`} className="px-3 py-1 text-xs bg-white border border-[#C4BCEF] rounded-md text-[#1A0089]! font-medium hover:bg-[#1A0089]/5">View</Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between border-t w-full py-4">
                            <p className="md:text-sm text-xs text-muted-foreground font-medium">
                                Showing {filteredOrders.length} of {records.length} orders
                            </p>

                            <div className="font-medium">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                className="text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] md:text-xs text-[11px] border-[0.5px]"
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                isActive
                                                className="bg-[#1A0089] text-white! hover:bg-[#14006b] md:text-xs text-[11px]"
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                className="text-[#1A0089]! hover:bg-[#1A0089]/10 hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] md:text-xs text-[11px]"
                                            >
                                                2
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                className="text-[#1A0089]! hover:bg-[#1A0089]/10 hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] md:text-xs text-[11px]"
                                            >
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                className="text-[#1A0089]! hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] md:text-xs text-[11px]"
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrderPage;