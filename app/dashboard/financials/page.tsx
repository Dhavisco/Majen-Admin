'use client';

import React, { useMemo, useState } from 'react';
import { FaArrowDownLong } from 'react-icons/fa6';

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type TransactionType = 'Credit' | 'Fee' | 'Payout';
type TransactionStatus = 'Completed' | 'Pending';
type TransactionTab = 'all' | 'sales' | 'payouts' | 'fees';

type Transaction = {
    id: string;
    description: string;
    designer: string;
    type: TransactionType;
    amount: string;
    date: string;
    status: TransactionStatus;
};

const FinancialPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TransactionTab>('all');

    const transactions: Transaction[] = useMemo(
        () => [
            {
                id: 'TXN-9821',
                description: 'Sale - Amara Braided Dress',
                designer: 'Yvonne Onyata',
                type: 'Credit',
                amount: '+N100,000',
                date: 'Mar 15',
                status: 'Completed',
            },
            {
                id: 'TXN-9820',
                description: 'Platform fee 10%',
                designer: 'Yvonne Onyata',
                type: 'Fee',
                amount: '-N10,000',
                date: 'Mar 15',
                status: 'Completed',
            },
            {
                id: 'TXN-9819',
                description: 'Monthly payout',
                designer: 'Joy Akigbe',
                type: 'Payout',
                amount: 'N45,000',
                date: 'Mar 14',
                status: 'Pending',
            },
        ],
        []
    );

    const tabs = [
        { label: 'All', value: 'all' as const, color: 'bg-gray-200 text-gray-700' },
        { label: 'Sales', value: 'sales' as const, color: 'bg-green-100 text-green-700' },
        { label: 'Payouts', value: 'payouts' as const, color: 'bg-amber-100 text-amber-700' },
        { label: 'Fees', value: 'fees' as const, color: 'bg-red-100 text-red-700' },
    ];

    const tabCounts = useMemo(() => {
        const sales = transactions.filter((t) => t.type === 'Credit').length;
        const payouts = transactions.filter((t) => t.type === 'Payout').length;
        const fees = transactions.filter((t) => t.type === 'Fee').length;

        return {
            all: transactions.length,
            sales,
            payouts,
            fees,
        };
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        if (activeTab === 'all') return transactions;
        if (activeTab === 'sales') return transactions.filter((t) => t.type === 'Credit');
        if (activeTab === 'payouts') return transactions.filter((t) => t.type === 'Payout');
        return transactions.filter((t) => t.type === 'Fee');
    }, [activeTab, transactions]);

    const getTypePill = (type: TransactionType) => {
        if (type === 'Credit') {
            return (
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold bg-green-100 text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Credit
                </span>
            );
        }

        if (type === 'Fee') {
            return (
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold bg-red-100 text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Fee
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold bg-amber-100 text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Payout
            </span>
        );
    };

    const getStatusPill = (status: TransactionStatus) => {
        if (status === 'Completed') {
            return (
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold bg-green-100 text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Completed
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold bg-amber-100 text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Pending
            </span>
        );
    };

    const getAmountClass = (amount: string) => {
        if (amount.startsWith('+')) return 'text-green-600';
        if (amount.startsWith('-')) return 'text-red-600';
        return 'text-amber-700';
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="md:text-2xl text-lg font-bold tracking-tight">Financials</h1>
                        <p className="text-muted-foreground md:text-sm text-xs mt-1">
                            Platform revenue, payouts and transaction history
                        </p>
                    </div>

                    <Button variant="outline" className="gap-2 font-medium">
                        <FaArrowDownLong />
                        Export
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Platform Revenue (MTD)
                        </p>
                        <p className="mt-2 text-xl md:text-2xl font-bold tracking-tight">N48.2M</p>
                        <p className="mt-2 text-green-600 text-xs md:text-sm font-medium">+22% vs last month</p>
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Outstanding Payouts
                        </p>
                        <p className="mt-2 text-xl md:text-2xl font-bold tracking-tight text-amber-600">N3.1M</p>
                        <p className="mt-2 text-amber-600 text-xs md:text-sm font-medium">12 pending disbursements</p>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white overflow-hidden">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="text-base md:text-lg font-bold tracking-tight">Transactions</h3>
                        <button className="text-[#1A0089] cursor-pointer hover:text-[#14006b] font-medium text-sm md:text-base">
                            Export CSV -
                        </button>
                    </div>

                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TransactionTab)} className="w-full">
                        <div className="overflow-x-auto lg:overflow-hidden scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full ">
                            <TabsList
                                variant="line"
                                className="bg-transparent px-2 border-b h-auto w-max min-w-full justify-start gap-2 flex-nowrap"
                            >
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="px-2 py-1 text-xs md:text-sm text-muted-foreground data-[state=active]:text-[#1A0089] data-[state=active]:font-semibold data-[state=active]:after:bg-[#1A0089] font-medium"
                                    >
                                        {tab.label}
                                        {tab.value === 'payouts' && (
                                            <span className={`ml-1 rounded-full px-2 py-0.5 text-sm font-semibold ${tab.color}`}>
                                                {tabCounts[tab.value]}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </Tabs>

                    <div className="overflow-x-auto lg:overflow-hidden scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <Table className="text-xs md:text-sm">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="sticky left-0 text-muted-foreground font-semibold bg-white z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                        ID
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DESCRIPTION</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DESIGNER</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">TYPE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">AMOUNT</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DATE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">STATUS</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="sticky left-0 bg-white z-10 group-hover:bg-muted/50 transition-colors after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                            <span className="inline-flex rounded-lg border bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                                                {tx.id}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{tx.description}</TableCell>
                                        <TableCell className="font-medium">{tx.designer}</TableCell>
                                        <TableCell className='text-xs lg:text-sm'>{getTypePill(tx.type)}</TableCell>
                                        <TableCell className={`font-semibold ${getAmountClass(tx.amount)}`}>{tx.amount}</TableCell>
                                        <TableCell className="text-muted-foreground font-medium">{tx.date}</TableCell>
                                        <TableCell className='text-xs lg:text-sm'>{getStatusPill(tx.status)}</TableCell>
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

export default FinancialPage;