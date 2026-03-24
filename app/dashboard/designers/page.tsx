'use client';

import React, { useMemo, useState } from 'react';

import {
    FaSearch,
    FaFilter,
    FaDownload,
    FaEye,
    FaCheck,
    FaTimes,
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

const DesignerPage: React.FC = () => {

    const [activeTab, setActiveTab] = useState('all');

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

    const designers = useMemo(() => [
        {
            id: 1,
            name: 'Yvonne Onyata',
            email: 'info@yvelabel.com',
            business: 'YVE Label',
            cac: 'RC 1234567',
            products: 25,
            joined: 'Jun 2024',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Kike Johnson',
            email: 'kikejohnson3@gmail.com',
            business: 'Liz&Co',
            cac: 'RC 1234567',
            products: 0,
            joined: 'Mar 2026',
            status: 'Pending'
        },
        {
            id: 3,
            name: 'Mary Johnson',
            email: 'maryjohnson@gmail.com',
            business: 'Mary Atelier',
            cac: 'RC 1234567',
            products: 5,
            joined: 'Jan 2024',
            status: 'Banned'
        },
        {
            id: 4,
            name: 'Joy Akigbe',
            email: 'joyakigbe34@gmail.com',
            business: 'Kuwaj',
            cac: 'RC 1234567',
            products: 18,
            joined: 'Aug 2024',
            status: 'Flagged'
        },
        {
            id: 5,
            name: 'Omowaju Ayotunde',
            email: 'shopmora.co@gmail.com',
            business: 'Shop Mora',
            cac: 'RC 1234567',
            products: 0,
            joined: 'Mar 2026',
            status: 'Pending'
        },
        {
            id: 6,
            name: 'Sarah Martin',
            email: 'smartin123@gmail.com',
            business: 'Sarah’s Designs',
            cac: 'RC 1234567',
            products: 6,
            joined: 'Sep 2024',
            status: 'Suspended'
        },
        {
            id: 7,
            name: 'Tolu Aribisala',
            email: 'spiceoflagos@gmail.com',
            business: 'Spice of Lagos',
            cac: 'RC 1234567',
            products: 5,
            joined: 'Nov 2024',
            status: 'Active'
        },
    ], []);

    const tabs = [
        { label: 'All', value: 'all', color: 'bg-gray-200 text-gray-700' },
        { label: 'Pending', value: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
        { label: 'Verified', value: 'Active', color: 'bg-green-100 text-green-700' },
        { label: 'Flagged', value: 'Flagged', color: 'bg-orange-100 text-orange-700' },
        { label: 'Suspended', value: 'Suspended', color: 'bg-orange-100 text-orange-700' },
        { label: 'Banned', value: 'Banned', color: 'bg-red-100 text-red-700' },
    ];

    const counts = useMemo(() => {

        const result: Record<string, number> = {
            all: designers.length
        };

        designers.forEach(d => {
            result[d.status] = (result[d.status] || 0) + 1;
        });

        return result;

    }, [designers]);


    const filteredDesigners = useMemo(() => {

        if (activeTab === 'all') return designers;

        return designers.filter(d => d.status === activeTab);

    }, [activeTab, designers]);


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
                    <h1 className="md:text-2xl text-lg font-bold tracking-tight">Designers</h1>
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

                <div className='bg-white rounded-xl border shadow-sm py-2 px-4'>

                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full rounded-none"
                    >
                        <div className="w-full overflow-x-auto max-w-[calc(100vw-4rem)] sm:max-w-full">
                            <TabsList
                                className="bg-transparent px-0 border-b h-auto w-max min-w-full justify-start gap-1 flex-nowrap"
                                variant="line"
                            >
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="px-4 text-xs md:text-sm text-muted-foreground data-[state=active]:text-[#1A0089] data-[state=active]:font-semibold data-[state=active]:after:bg-[#1A0089] font-medium"
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
                                className="pl-10 bg-white text-xs md:text-base"
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
                    <div className="overflow-x-auto w-full mt-4 max-w-[calc(100vw-4rem)] sm:max-w-full">

                        <Table className='text-xs md:text-base'>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>DESIGNER</TableHead>
                                    <TableHead>BUSINESS</TableHead>
                                    <TableHead>CAC</TableHead>
                                    <TableHead>PRODUCTS</TableHead>
                                    <TableHead>JOINED</TableHead>
                                    <TableHead>STATUS</TableHead>
                                    <TableHead>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>

                                {filteredDesigners.map((designer) => (

                                    <TableRow key={designer.id} className="hover:bg-muted/50 transition-colors">

                                        <TableCell>
                                            <div className="flex items-center gap-3">

                                                <div className="md:w-9 md:h-9 w-7 h-7 bg-linear-to-br from-[#1A0089] to-indigo-600 text-white md:text-sm text-[10px] rounded-full flex items-center justify-center font-medium">
                                                    {designer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </div>

                                                <div className='md:text-xs text-[11px]'>
                                                    <div className="font-medium">{designer.name}</div>
                                                    <div className="text-muted-foreground">{designer.email}</div>
                                                </div>

                                            </div>
                                        </TableCell>

                                        <TableCell className="font-medium md:text-xs text-[11px]">{designer.business}</TableCell>

                                        <TableCell className="text-muted-foreground font-mono md:text-xs text-[11px]">{designer.cac}</TableCell>

                                        <TableCell className="md:text-xs text-[11px]">{designer.products}</TableCell>

                                        <TableCell className="text-muted-foreground md:text-xs text-[11px]">{designer.joined}</TableCell>

                                        <TableCell className="md:text-xs text-[11px]">
                                            {getStatusBadge(designer.status)}
                                        </TableCell>

                                        <TableCell>

                                            <div className="flex gap-2 whitespace-nowrap">

                                                {designer.status === 'Pending' ? (

                                                    <>
                                                        <Button size="sm" className="bg-[#1A0089] hover:bg-[#14006b] font-medium md:text-xs text-[11px]">
                                                            <FaCheck className="mr-1" /> Verify
                                                        </Button>

                                                        <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-100 font-medium md:text-xs text-[11px]">
                                                            <FaTimes className="mr-1" /> Reject
                                                        </Button>

                                                        <Button size="sm" variant="outline" className='text-[#1A0089] hover:bg-[#14006b] border-[#1900894b] font-medium md:text-xs text-[11px]'>
                                                            View
                                                        </Button>
                                                    </>

                                                ) : (

                                                    <Button size="sm" variant="outline">
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
                                Showing {filteredDesigners.length} of {designers.length} designers
                            </p>

                            <div className='font-medium'>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                className="text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] md:text-xs text-[11px]  border-[0.5px]"
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

export default DesignerPage;