'use client';

import React, { useMemo, useState } from 'react';

import {
    FaSearch,
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

const ClientPage: React.FC = () => {

    const [activeTab, setActiveTab] = useState('all');

    const metrics = [
        {
            title: 'Total clients',
            value: '8,420',
            indicator: { type: 'percentage' as const, value: 12 },
            icon: <FaUsers className="w-5 h-5" />,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'Active accounts',
            value: '7,840',
            // indicator: { type: 'percentage' as const, value: 8 },
            icon: <FaCheckCircle className="w-5 h-5" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Flagged',
            value: '14',
            indicator: { type: 'text' as const, text: 'Review', tone: 'warning' },
            icon: <FaClock className="w-5 h-5" />,
            color: 'bg-yellow-100 text-yellow-600',
        },
        {
            title: 'Suspended / Banned',
            value: '6',
            indicator: { type: 'text' as const, text: '2 flagged', tone: 'danger' },
            icon: <FaBan className="w-5 h-5" />,
            color: 'bg-red-100 text-red-600',
        },
    ] as const;

    const clients = useMemo(() => [
        {
            id: 1,
            name: 'Yvonne Onyata',
            email: 'info@yvelabel.com',
            location: 'Lagos',
            orders: '24',
            totalspent: 620,
            lastactive: 'Mar 14',
            status: 'Active'

        },
        {
            id: 2,
            name: 'Kike Johnson',
            email: 'kikejohnson3@gmail.com',
            location: 'Abuja',
            orders: '18',
            totalspent: 620,
            lastactive: 'Mar 14',
            status: 'Pending'
        },
        {
            id: 3,
            name: 'Mary Johnson',
            email: 'maryjohnson@gmail.com',
            location: 'Abuja',
            orders: '12',
            totalspent: 620,
            lastactive: 'Mar 14',
            status: 'Banned'
        },
        {
            id: 4,
            name: 'Joy Akigbe',
            email: 'joyakigbe34@gmail.com',
            location: 'Lagos',
            orders: '12',
            totalspent: 620,
            lastactive: 'Mar 14',
            status: 'Flagged'
        },
        {
            id: 5,
            name: 'Omowaju Ayotunde',
            email: 'shopmora.co@gmail.com',
            location: 'Port Harcourt',
            orders: '15',
            totalspent: 620,
            lastactive: 'Mar 14',
            status: 'Pending'
        },
        {
            id: 6,
            name: 'Sarah Martin',
            email: 'smartin123@gmail.com',
            location: 'Abuja',
            orders: '17',
            totalspent: 620,
            lastactive: 'Mar 14',
            status: 'Suspended'
        },
        {
            id: 7,
            name: 'Tolu Aribisala',
            email: 'spiceoflagos@gmail.com',
            location: 'Lagos',
            orders: '24',
            totalspent: 620,
            lastactive: 'Mar 14',
            status: 'Active'
        },
    ], []);

    const tabs = [
        { label: 'All', value: 'all', color: 'bg-gray-200 text-gray-700' },
        // { label: 'Pending', value: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
        { label: 'Verified', value: 'Active', color: 'bg-green-100 text-green-700' },
        { label: 'Flagged', value: 'Flagged', color: 'bg-orange-100 text-orange-700' },
        { label: 'Suspended', value: 'Suspended', color: 'bg-orange-100 text-orange-700' },
        { label: 'Banned', value: 'Banned', color: 'bg-red-100 text-red-700' },
    ];

    const counts = useMemo(() => {

        const result: Record<string, number> = {
            all: clients.length
        };

        clients.forEach(d => {
            result[d.status] = (result[d.status] || 0) + 1;
        });

        return result;

    }, [clients]);


    const filteredDesigners = useMemo(() => {

        if (activeTab === 'all') return clients;

        return clients.filter(d => d.status === activeTab);

    }, [activeTab, clients]);


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
        <DashboardLayout>
            <div className="space-y-6 md:p-0">

                <div>
                    <h1 className="md:text-xl lg:text-2xl text-lg font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground md:text-sm text-xs mt-1">
                        Manage client accounts, flags and purchase history
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
                                placeholder="Search by name, or email..."
                                className="pl-10 bg-white text-xs md:text-sm"
                            />
                        </div>

                        {/* <div className="flex items-center gap-2">

                            <Button variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
                                <FaFilter className="md:h-4 md:w-4 h-2 w-2" />
                                Filter
                            </Button>

                            <Button variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
                                <FaDownload className="md:h-4 md:w-4 h-2 w-2" />
                                Export
                            </Button>

                        </div> */}

                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">

                        <Table className='text-xs md:text-base'>

                            <TableHeader>
                                <TableRow className='text-xs md:text-sm '>
                                    <TableHead className="sticky left-0 text-muted-foreground font-semibold bg-white z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                        CLIENT
                                    </TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>LOCATION</TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>ORDERS</TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>TOTAL SPENT</TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>LAST ACTIVE</TableHead>
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

                                        <TableCell className="font-medium text-muted-foreground md:text-sm text-[11px]">

                                            <div>{designer.location}</div>
                                        </TableCell>

                                        <TableCell className="font-bold font-mono md:text-sm text-[11px]">
                                            <div className=''>
                                                {designer.orders}
                                            </div>

                                        </TableCell>

                                        <TableCell className="font-bold md:text-sm text-[11px]">{'₦'}{designer.totalspent}{'K'}</TableCell>

                                        <TableCell className="font-medium text-muted-foreground md:text-sm text-[11px]">{designer.lastactive}</TableCell>

                                        <TableCell className="md:text-sm font-semibold text-[11px]">
                                            {getStatusBadge(designer.status)}
                                        </TableCell>

                                        <TableCell className=" bg-white z-10 group-hover:bg-muted/50 transition-colors before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border">

                                            <div className="flex gap-2 whitespace-nowrap">

                                                {designer.status === 'Flagged' ? (

                                                    <>
                                                        <Button size="sm" variant="outline" className='text-[#1A0089] hover:text-white hover:bg-[#14006b] border-[#1900894b] cursor-pointer font-medium md:text-xs text-[11px]'>
                                                            View {'-->'}
                                                        </Button>

                                                        <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-100 cursor-pointer font-medium md:text-xs text-[11px]">
                                                            Ban
                                                        </Button>


                                                    </>

                                                ) : (

                                                    <Button size="sm" variant="outline" className='cursor-pointer'>
                                                        <FaEye className="mr-2" /> View profile
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
                                Showing {filteredDesigners.length} of {clients.length} clients
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
        </DashboardLayout>
    );
};

export default ClientPage;