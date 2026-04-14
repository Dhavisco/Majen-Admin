'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ModerationActionButton from '@/app/components/ModerationAction/ModerationActionButton';

import {
    FaSearch,
    FaFilter,
    FaDownload,
    FaEye,
    FaUsers,
    FaCheckCircle,
    FaClock,
    FaBan
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
import MetricCard from '@/app/components/MetricCard/MetricCard';
import { designers, type DesignerStatus } from '@/app/dashboard/designers/data';

type DesignerTab = 'all' | 'pending' | 'verified' | 'flagged' | 'suspended' | 'banned';

const statusByTab: Record<Exclude<DesignerTab, 'all'>, DesignerStatus> = {
    pending: 'Pending',
    verified: 'Active',
    flagged: 'Flagged',
    suspended: 'Suspended',
    banned: 'Banned',
};

const queryToTab = (value: string | null): DesignerTab => {
    switch ((value ?? '').toLowerCase()) {
        case 'pending':
            return 'pending';
        case 'verified':
        case 'active':
            return 'verified';
        case 'flagged':
            return 'flagged';
        case 'suspended':
            return 'suspended';
        case 'banned':
            return 'banned';
        default:
            return 'all';
    }
};

const DesignersPageContent: React.FC = () => {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<DesignerTab>('all');

    useEffect(() => {
        setActiveTab(queryToTab(searchParams.get('tab')));
    }, [searchParams]);

    const metrics = [
        {
            title: 'Total designers',
            value: '1,000',
            indicator: { type: 'percentage' as const, value: 12 },
            icon: <FaUsers className="w-5 h-5" />,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'Verified',
            value: '500',
            indicator: { type: 'percentage' as const, value: 8 },
            icon: <FaCheckCircle className="w-5 h-5" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Pending review',
            value: '4',
            indicator: { type: 'text' as const, text: 'Needs action', tone: 'warning' },
            icon: <FaClock className="w-5 h-5" />,
            color: 'bg-yellow-100 text-yellow-600',
        },
        {
            title: 'Suspended / Banned',
            value: '3',
            indicator: { type: 'text' as const, text: '2 flagged', tone: 'danger' },
            icon: <FaBan className="w-5 h-5" />,
            color: 'bg-red-100 text-red-600',
        },
    ] as const;

    const tabs = [
        { label: 'All', value: 'all' as const, color: 'bg-gray-200 text-gray-700' },
        { label: 'Pending', value: 'pending' as const, color: 'bg-yellow-100 text-yellow-700' },
        { label: 'Verified', value: 'verified' as const, color: 'bg-green-100 text-green-700' },
        { label: 'Flagged', value: 'flagged' as const, color: 'bg-orange-100 text-orange-700' },
        { label: 'Suspended', value: 'suspended' as const, color: 'bg-orange-100 text-orange-700' },
        { label: 'Banned', value: 'banned' as const, color: 'bg-red-100 text-red-700' },
    ];

    const counts = useMemo(() => {
        return {
            all: designers.length,
            pending: designers.filter((d) => d.status === 'Pending').length,
            verified: designers.filter((d) => d.status === 'Active').length,
            flagged: designers.filter((d) => d.status === 'Flagged').length,
            suspended: designers.filter((d) => d.status === 'Suspended').length,
            banned: designers.filter((d) => d.status === 'Banned').length,
        };
    }, []);


    const filteredDesigners = useMemo(() => {
        if (activeTab === 'all') return designers;
        return designers.filter((d) => d.status === statusByTab[activeTab]);
    }, [activeTab]);


    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case 'Pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
            case 'Flagged':
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Flagged</Badge>;
            case 'Suspended':
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Suspended</Badge>;
            case 'Banned':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Banned</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 md:p-0">

            <div>
                <h1 className="md:text-xl lg:text-2xl text-lg font-bold tracking-tight">Designers</h1>
                <p className="text-muted-foreground md:text-sm text-xs mt-1">
                    Verify sellers, manage accounts and review applications
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                    <MetricCard key={i} {...metric} />
                ))}
            </div>

            <div className='bg-white rounded-xl border shadow-sm md:py-2 md:px-4 py-1 px-2'>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as DesignerTab)}
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
                                    <span className={`text-[10px] md:text-[11px] flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full font-medium ${tab.color}`}>
                                        {counts[tab.value] ?? 0}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </Tabs>


                {/* Search + Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-5 w-full mt-4">

                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email or CAC number..."
                            className="pl-10 bg-white text-xs md:text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">

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

                {/* Table */}
                <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">

                    <Table className='text-xs md:text-base'>

                        <TableHeader>
                            <TableRow className='text-xs md:text-sm font-semibold'>
                                <TableHead className="sticky left-0 text-muted-foreground font-semibold bg-white z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                    DESIGNER
                                </TableHead>
                                <TableHead className='text-muted-foreground font-semibold'>BUSINESS</TableHead>
                                <TableHead className='text-muted-foreground font-semibold'>CAC</TableHead>
                                <TableHead className='text-muted-foreground font-semibold'>PRODUCTS</TableHead>
                                <TableHead className='text-muted-foreground font-semibold'>JOINED</TableHead>
                                <TableHead className='text-muted-foreground font-semibold'>STATUS</TableHead>
                                <TableHead className="text-muted-foreground font-semibold bg-white z-10">
                                    ACTIONS
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {filteredDesigners.map((designer) => (

                                <TableRow key={designer.id} className="group hover:bg-muted/50 transition-colors">

                                    <TableCell className="sticky left-0 bg-white z-10 group-hover:bg-muted/50 transition-colors after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                        <div className="flex items-center gap-1 md:gap-3">

                                            <div className="md:w-9 md:h-9 w-5 h-5 bg-linear-to-br from-[#1A0089] to-indigo-600 text-white md:text-sm text-[8px] rounded-full flex items-center justify-center font-medium">
                                                {designer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>

                                            <div className='md:text-sm text-[11px]'>
                                                <div className="font-semibold">{designer.name}</div>
                                                <div className="text-muted-foreground">{designer.email}</div>
                                            </div>

                                        </div>
                                    </TableCell>

                                    <TableCell className="font-semibold md:text-sm text-[11px]">
                                        <div className=''>
                                            <div>{designer.business}</div>
                                            <div className='md:text-xs text-[10px] text-muted-foreground font-medium'>{designer.type}</div>
                                        </div>

                                    </TableCell>

                                    <TableCell className=" md:text-sm text-[11px]">
                                        <div className=' bg-[#F4F4F5] px-2 font-extralight text-muted-foreground font-mono py-0.5 border border-[#E4E4E7] p-1 rounded-sm'>
                                            {designer.cac}
                                        </div>

                                    </TableCell>

                                    <TableCell className="font-bold md:text-sm text-[11px]">{designer.products}</TableCell>

                                    <TableCell className="font-medium text-muted-foreground md:text-sm text-[11px]">{designer.joined}</TableCell>

                                    <TableCell className="md:text-sm font-semibold text-[11px]">
                                        {getStatusBadge(designer.status)}
                                    </TableCell>

                                    <TableCell className=" bg-white z-10 group-hover:bg-muted/50 transition-colors before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border">

                                        <div className="flex gap-2 whitespace-nowrap">

                                            {designer.status === 'Pending' ? (

                                                <>
                                                    <ModerationActionButton
                                                        action="verify-account"
                                                        subject={`${designer.name} · ${designer.business}`}
                                                        buttonLabel="Verify"
                                                        buttonSize="sm"
                                                        buttonClassName="bg-[#1A0089] hover:bg-[#14006b] cursor-pointer font-medium md:text-xs text-[11px]"
                                                    />

                                                    <ModerationActionButton
                                                        action="reject-application"
                                                        subject={`${designer.name} · ${designer.business}`}
                                                        buttonLabel="Reject"
                                                        buttonVariant="outline"
                                                        buttonSize="sm"
                                                        buttonClassName="border-red-500 text-red-600 hover:bg-red-100 cursor-pointer font-medium md:text-xs text-[11px]"
                                                    />

                                                    <Button size="sm" variant="outline" asChild className='text-[#1A0089] hover:text-white hover:bg-[#14006b] border-[#1900894b] cursor-pointer font-medium md:text-xs text-[11px]'>
                                                        <Link href={`/dashboard/designers/${designer.id}`}>View</Link>
                                                    </Button>
                                                </>

                                            ) : (

                                                <Button size="sm" variant="outline" asChild className='cursor-pointer'>
                                                    <Link href={`/dashboard/designers/${designer.id}`}>
                                                        <FaEye className="mr-2" /> View profile
                                                    </Link>
                                                </Button>

                                            )}

                                        </div>

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                    {/* Pagination */}

                    <div className="flex items-center justify-between border-t w-full py-4">

                        <p className="md:text-sm text-xs text-muted-foreground font-medium">
                            Showing {filteredDesigners.length} of {designers.length} designers
                        </p>

                        <div className='font-medium'>
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
    );
};

const DesignerPage: React.FC = () => {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading designers...</div>}>
                <DesignersPageContent />
            </Suspense>
        </DashboardLayout>
    );
};

export default DesignerPage;