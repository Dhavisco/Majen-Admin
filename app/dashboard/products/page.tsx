'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import { FaUsers, FaCheckCircle, FaClock, FaBan, FaSearch, FaFilter } from 'react-icons/fa';

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
import { FaArrowDownLong } from 'react-icons/fa6';
import { useProducts } from '@/hooks/products/useProducts';
import type { ProductRecord } from '@/lib/api/products';

const tabs = [
    { label: 'All', value: 'all', color: 'bg-gray-200 text-gray-700' },
    { label: 'Pending review', value: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Active', value: 'Active', color: 'bg-green-100 text-green-700' },
    { label: 'Rejected', value: 'Rejected', color: 'bg-red-100 text-red-700' },
];

// Map ProductRecord to UI Product type for table rendering
type UIProduct = {
    id: number;
    name: string;
    price: string;
    status: string;
    designer: string;
    category: string;
    stock: number;
};

const ProductPage: React.FC = () => {

    const [activeTab, setActiveTab] = useState('all');
    const [searchInput, setSearchInput] = useState('');

    // Price Formatter (₦ + commas)
    const formatPrice = (price: string | number): string => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(num)) return '₦0';

        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(num).replace('NGN', '₦');
    };

    // Map UI tab to backend status for query
    const backendStatus = useMemo(() => {
        switch (activeTab) {
            case 'Active':
                return 'ACTIVE';
            case 'Pending':
                return 'PENDING';
            case 'Rejected':
                return 'REJECTED';
            default:
                return undefined;
        }
    }, [activeTab]);


    const {
        metrics,
        products: apiProducts,
        isLoading,
    } = useProducts({
        page: 1,
        limit: 10,
        status: backendStatus,
        search: searchInput || undefined,
    });

    // Map API products to UI products
    const products: UIProduct[] = useMemo(() =>
        apiProducts.map((p: ProductRecord) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            stock: p.quantity,
            status:
                p.status === 'ACTIVE' ? 'Active' :
                    p.status === 'PENDING' ? 'Pending' :
                        p.status === 'REJECTED' ? 'Rejected' : p.status,
            designer: p.business?.businessName || '',
            category: p.category?.name || '',
        })),
        [apiProducts]
    );

    // Build counts for tabs
    const counts = useMemo(() => {
        const result: Record<string, number> = { all: products.length };
        products.forEach((d: UIProduct) => {
            result[d.status] = (result[d.status] || 0) + 1;
        });
        return result;
    }, [products]);

    // Filtered products for UI (tab logic)
    const filteredProducts = useMemo(() => {
        if (activeTab === 'all') return products;
        return products.filter((d: UIProduct) => d.status === activeTab);
    }, [activeTab, products]);

    // Fix metrics to use correct indicator types
    const safeMetrics = metrics.map((metric, i) => {
        let indicator = undefined;
        if (metric.indicator && typeof metric.indicator === 'object') {
            if (metric.indicator.type === 'percentage') {
                indicator = { type: 'percentage' as const, value: (metric.indicator as { value: number }).value };
            } else if (metric.indicator.type === 'text') {
                // Only allow valid IndicatorTone values
                let tone: 'neutral' | 'warning' | 'danger' | 'success' | undefined = undefined;
                if (['neutral', 'warning', 'danger', 'success'].includes((metric.indicator as { tone?: string }).tone || '')) {
                    tone = (metric.indicator as { tone?: 'neutral' | 'warning' | 'danger' | 'success' }).tone;
                }
                indicator = { type: 'text' as const, text: (metric.indicator as { text: string }).text, tone };
            }
        }
        return {
            ...metric,
            indicator,
            icon:
                i === 0 ? <FaUsers className="w-5 h-5" /> :
                    i === 1 ? <FaCheckCircle className="w-5 h-5" /> :
                        i === 2 ? <FaClock className="w-5 h-5" /> :
                            <FaBan className="w-5 h-5" />,
        };
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case 'Pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending review</Badge>;
            case 'Rejected':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">

                <div className='flex justify-between'>
                    <div>  <h1 className="md:text-xl lg:text-2xl text-lg font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground md:text-sm text-xs mt-1">
                            Manage product all listings across the platform
                        </p>
                    </div>
                    <div className='flex items-center text-sm md:text-base bg-white px-4 gap-1 rounded-xl'>
                        <FaArrowDownLong className='' />
                        <div>Export</div>
                    </div>

                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4 bg-white shadow rounded-lg animate-pulse">
                                <div className="flex items-start justify-between">
                                    <div className="p-2 rounded-full w-9 h-9 bg-gray-200" />
                                    <div className="w-12 h-4 bg-gray-200 rounded ml-2" />
                                </div>
                                <div className="mt-4 h-6 w-3/4 bg-gray-200 rounded" />
                                <div className="mt-2 h-3 w-1/2 bg-gray-200 rounded" />
                            </div>
                        ))
                    ) : (

                        safeMetrics.map((metric, i) => (
                            <MetricCard key={i} {...metric} />
                        ))
                    )}
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
                                placeholder="Search by product name, or designer..."
                                className="pl-10 bg-white text-xs md:text-sm"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">

                            <Button variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
                                <FaFilter className="md:h-4 md:w-4 h-2 w-2" />
                                Filter
                            </Button>

                            {/* <Button variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
                                <FaDownload className="md:h-4 md:w-4 h-2 w-2" />
                                Export
                            </Button> */}

                        </div>

                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">

                        <Table className='text-xs md:text-base'>

                            <TableHeader>
                                <TableRow className='text-xs md:text-sm '>
                                    <TableHead className="sticky left-0 text-muted-foreground font-semibold bg-white z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                        PRODUCT
                                    </TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>DESIGNER</TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>CATEGORY</TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>PRICE</TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>STOCK</TableHead>
                                    <TableHead className='text-muted-foreground font-semibold'>STATUS</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">
                                        ACTIONS
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>

                                {isLoading
                                    ? Array.from({ length: 10 }).map((_, idx) => (
                                        <TableRow key={`skeleton-${idx}`} className="animate-pulse">
                                            <TableCell className="py-3">
                                                <div className="flex items-center gap-1 md:gap-3">
                                                    <div className="md:w-9 md:h-9 w-5 h-5 rounded-full bg-gray-200" />
                                                    <div className="w-40 h-4 bg-gray-200 rounded" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-32 h-4 bg-gray-200 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-24 h-4 bg-gray-200 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-20 h-4 bg-gray-200 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-16 h-4 bg-gray-200 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-16 h-4 bg-gray-200 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-24 h-6 bg-gray-200 rounded" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : filteredProducts.map((product: UIProduct) => (
                                        <TableRow key={product.id} className="group hover:bg-muted/50 transition-colors">
                                            <TableCell className="sticky left-0 bg-white z-10 group-hover:bg-muted/50 transition-colors after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                                <div className="flex items-center gap-1 md:gap-3">
                                                    <div className="md:w-9 md:h-9 w-5 h-5 bg-linear-to-br from-[#1A0089] to-indigo-600 text-white md:text-sm text-[8px] rounded-full flex items-center justify-center font-medium">
                                                        {product.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <div className='md:text-sm text-[11px]'>
                                                        <div className="font-semibold">{product.name}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium md:text-sm text-[11px]">{product.designer}</TableCell>
                                            <TableCell className="font-medium font-mono md:text-sm text-[11px]">
                                                <div className=''>
                                                    {product.category}
                                                </div>
                                            </TableCell>

                                            <TableCell className="font-medium md:text-sm text-[11px] font-mono">
                                                {formatPrice(product.price)}
                                            </TableCell>
                                            <TableCell className="font-medium md:text-sm text-[11px]">{product.stock}</TableCell>
                                            <TableCell className="md:text-sm font-semibold text-[11px]">
                                                {getStatusBadge(product.status)}
                                            </TableCell>
                                            <TableCell className=" bg-white z-10 group-hover:bg-muted/50 transition-colors before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border">
                                                <div className="flex gap-2 whitespace-nowrap">
                                                    <Link href={`/dashboard/products/${product.id}`}>
                                                        <Button size="sm" variant="outline" className='text-[#1A0089] hover:text-white hover:bg-[#14006b] border-[#1900894b] cursor-pointer font-medium md:text-xs text-[11px]'>
                                                            View
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>

                        </Table>

                        {/* Pagination */}

                        <div className="flex items-center justify-between border-t w-full py-4">

                            <p className="md:text-sm text-xs text-muted-foreground font-medium">
                                Showing {filteredProducts.length} of {products.length} products
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

export default ProductPage;