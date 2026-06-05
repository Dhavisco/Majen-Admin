'use client'

import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { FaArrowDownLong } from 'react-icons/fa6'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getTransactionsSummary, type TransactionRecord, type TransactionType } from '@/lib/api/transactions'

type TransactionTab = 'all' | TransactionType

const PAGE_SIZE = 10

const tabs: Array<{ label: string; value: TransactionTab }> = [
    { label: 'All', value: 'all' },
    { label: 'Order payments', value: 'ORDER_PAYMENT' },
    { label: 'Payouts', value: 'PAYOUT' },
    { label: 'Fees', value: 'FEE' },
]

const formatCurrency = (value: string | number) => {
    const parsed = typeof value === 'string' ? Number.parseFloat(value) : value

    if (Number.isNaN(Number(parsed))) {
        return '₦0'
    }

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(Number(parsed))
        .replace('NGN', '₦')
}

const formatDate = (value: string) => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return '—'
    }

    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

const getTransactionTypeLabel = (type: string) => {
    switch (type.toUpperCase()) {
        case 'ORDER_PAYMENT':
            return 'Order payment'
        case 'PAYOUT':
            return 'Payout'
        case 'FEE':
            return 'Fee'
        default:
            return type.replaceAll('_', ' ')
    }
}

const getTypePillClass = (type: string) => {
    switch (type.toUpperCase()) {
        case 'ORDER_PAYMENT':
            return 'bg-emerald-100 text-emerald-700'
        case 'PAYOUT':
            return 'bg-amber-100 text-amber-700'
        case 'FEE':
            return 'bg-red-100 text-red-600'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const getStatusPillClass = (status: string) => {
    switch (status.toUpperCase()) {
        case 'SUCCESS':
            return 'bg-green-100 text-green-700'
        case 'PENDING':
            return 'bg-amber-100 text-amber-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const getDirectionPillClass = (direction: string) => {
    switch (direction.toUpperCase()) {
        case 'DEBIT':
            return 'bg-rose-100 text-rose-700'
        case 'CREDIT':
            return 'bg-emerald-100 text-emerald-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

function FinancialPageSkeleton() {
    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0 animate-pulse">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="h-7 w-40 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
                    </div>
                    <div className="h-10 w-24 rounded bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="h-28 rounded-2xl bg-gray-200" />
                    <div className="h-28 rounded-2xl bg-gray-200" />
                </div>

                <div className="rounded-2xl border bg-white overflow-hidden">
                    <div className="h-16 border-b bg-gray-200" />
                    <div className="h-12 border-b bg-gray-200" />
                    <div className="space-y-2 p-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-14 rounded bg-gray-200" />
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

const FinancialPage = () => {
    const [activeTab, setActiveTab] = useState<TransactionTab>('all')
    const [currentPage, setCurrentPage] = useState(1)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['financials', 'transactions', { currentPage, activeTab }],
        queryFn: () =>
            getTransactionsSummary({
                pagination: true,
                page: currentPage,
                limit: PAGE_SIZE,
                type: activeTab === 'all' ? undefined : activeTab,
            }),
        placeholderData: keepPreviousData,
    })

    const result = data
    const meta = result?.meta
    const stats = result?.transactionStats
    const records = result?.records ?? []
    const derivedPageCount = Math.ceil((meta?.totalCount ?? 0) / (meta?.perPage ?? PAGE_SIZE))
    const pageCount = Math.max(derivedPageCount, 1)

    // const activeTabLabel = tabs.find((tab) => tab.value === activeTab)?.label ?? 'All'

    const handlePageChange = (pageNumber: number) => {
        const nextPage = Math.min(Math.max(pageNumber, 1), pageCount)
        setCurrentPage(nextPage)
    }

    if (isLoading && !data) {
        return <FinancialPageSkeleton />
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                        <h1 className="md:text-2xl text-lg font-bold tracking-tight">Financials</h1>
                        <p className="text-muted-foreground md:text-sm text-xs mt-1">
                            Platform revenue, payouts and transaction history
                        </p>
                    </div>

                    <Button variant="outline" className="gap-2 font-medium self-start">
                        <FaArrowDownLong />
                        Export
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Platform Revenue
                        </p>
                        <p className="mt-2 text-xl md:text-2xl font-bold tracking-tight">
                            {formatCurrency(stats?.revenue.current ?? 0)}
                        </p>
                        <p className={`mt-2 text-xs md:text-sm font-medium ${((stats?.revenue.growth ?? 0) >= 0) ? 'text-green-600' : 'text-rose-600'}`}>
                            {(stats?.revenue.growth ?? 0) >= 0 ? '+' : ''}{stats?.revenue.growth ?? 0}% vs last month
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Pending Payouts
                        </p>
                        <p className="mt-2 text-xl md:text-2xl font-bold tracking-tight text-amber-600">
                            {formatCurrency(stats?.pendingPayouts.sum ?? 0)}
                        </p>
                        <p className="mt-2 text-amber-600 text-xs md:text-sm font-medium">
                            {stats?.pendingPayouts.count ?? 0} pending disbursements
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white overflow-hidden">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b px-4 py-3">
                        <div>
                            <h3 className="text-base md:text-lg font-bold tracking-tight">Transactions</h3>
                            {/* <p className="text-xs md:text-sm text-muted-foreground">Filtered by {activeTabLabel.toLowerCase()}</p> */}
                        </div>
                        <button className="text-[#1A0089] cursor-pointer hover:text-[#14006b] font-medium text-sm md:text-base text-left sm:text-right">
                            Export CSV -
                        </button>
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            setActiveTab(value as TransactionTab)
                            setCurrentPage(1)
                        }}
                        className="w-full"
                    >
                        <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                            <TabsList
                                variant="line"
                                className="bg-transparent px-2 border-b h-auto w-max min-w-full justify-start gap-2 flex-nowrap"
                            >
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="px-2 py-1 text-xs md:text-sm text-muted-foreground data-[state=active]:text-[#1A0089] data-[state=active]:font-semibold data-[state=active]:after:bg-[#1A0089] font-medium whitespace-nowrap"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </Tabs>

                    {isError ? (
                        <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Unable to load transactions right now. Please try again.
                        </div>
                    ) : null}

                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <Table className="text-xs md:text-sm">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="sticky left-0 text-muted-foreground font-semibold bg-white z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                        TRANSACTION ID
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DESCRIPTION</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">BUSINESS</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">TYPE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DIRECTION</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">ORDER STATUS</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">DATE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">STATUS</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {records.length > 0 ? (
                                    records.map((tx: TransactionRecord) => (
                                        <TableRow key={tx.id} className="group hover:bg-muted/50 transition-colors">
                                            <TableCell className="sticky left-0 bg-white z-10 group-hover:bg-muted/50 transition-colors after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                                <span className="inline-flex rounded-lg border bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                                                    {tx.transactionId}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium">{tx.description ?? '—'}</TableCell>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p>{tx.business?.businessName ?? '—'}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {tx.business?.user ? `${tx.business.user.firstName} ${tx.business.user.lastName}`.trim() : '—'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${getTypePillClass(tx.type)}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {getTransactionTypeLabel(tx.type)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${getDirectionPillClass(tx.direction)}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {tx.direction}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold bg-slate-100 text-slate-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {tx.order?.status ?? '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium">{formatDate(tx.createdAt)}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${getStatusPillClass(tx.status)}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {tx.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                                            No transactions found for the selected filter.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex flex-col gap-3 border-t w-full px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="md:text-sm text-xs text-muted-foreground font-medium">
                                Showing {records.length} of {meta?.totalCount ?? 0} transactions
                            </p>

                            {pageCount > 1 ? (
                                <div className="font-medium">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        if (currentPage > 1) handlePageChange(currentPage - 1)
                                                    }}
                                                    aria-disabled={currentPage <= 1}
                                                    className="text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] md:text-xs text-[11px] border-[0.5px]"
                                                />
                                            </PaginationItem>

                                            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                                                <PaginationItem key={pageNumber}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={pageNumber === currentPage}
                                                        onClick={(event) => {
                                                            event.preventDefault()
                                                            handlePageChange(pageNumber)
                                                        }}
                                                        className={pageNumber === currentPage ? 'bg-[#1A0089] text-white! hover:bg-[#14006b] md:text-xs text-[11px]' : 'text-[#1A0089]! hover:bg-[#1A0089]/10 hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] md:text-xs text-[11px]'}
                                                    >
                                                        {pageNumber}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        if (currentPage < pageCount) handlePageChange(currentPage + 1)
                                                    }}
                                                    aria-disabled={currentPage >= pageCount}
                                                    className="text-[#1A0089]! hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] md:text-xs text-[11px]"
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            ) : (
                                <div className="rounded-full border border-[#1A00894b] bg-[#1A00890a] px-3 py-1 text-xs font-medium text-[#1A0089]">
                                    Page 1 of 1
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default FinancialPage