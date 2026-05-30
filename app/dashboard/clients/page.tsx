'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { FaSearch, FaEye, FaUsers, FaCheckCircle, FaClock, FaBan } from 'react-icons/fa'
import { FaArrowDownLong } from 'react-icons/fa6'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import MetricCard from '@/app/components/MetricCard/MetricCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getClientsSummary, type ClientRecord, type ClientStatus } from '@/lib/api/clients'

type TabValue = 'all' | ClientStatus

const PAGE_SIZE = 10

const tabs: Array<{ label: string; value: TabValue; color: string }> = [
    { label: 'All', value: 'all', color: 'bg-gray-200 text-gray-700' },
    { label: 'Active', value: 'ACTIVE', color: 'bg-green-100 text-green-700' },
    { label: 'Flagged', value: 'FLAGGED', color: 'bg-orange-100 text-orange-700' },
    { label: 'Suspended', value: 'SUSPENDED', color: 'bg-amber-100 text-amber-700' },
    { label: 'Banned', value: 'BANNED', color: 'bg-red-100 text-red-700' },
]

const formatNumber = (value: number) => new Intl.NumberFormat('en-NG').format(value)

const formatCurrency = (value?: string | number) => {
    const parsed = typeof value === 'string' ? Number.parseFloat(value) : value ?? 0

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

const formatDate = (value: string | null) => {
    if (!value) return '—'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return '—'
    }

    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

const formatClientName = (client: Pick<ClientRecord, 'firstName' | 'lastName'>) =>
    [client.firstName, client.lastName].filter(Boolean).join(' ').trim() || '—'

const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
        case 'ACTIVE':
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
        case 'FLAGGED':
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Flagged</Badge>
        case 'SUSPENDED':
            return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Suspended</Badge>
        case 'BANNED':
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Banned</Badge>
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

function ClientPageSkeleton() {
    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0 animate-pulse">
                <div>
                    <div className="h-7 w-36 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-lg border bg-white p-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200" />
                            <div className="mt-4 h-8 w-20 rounded bg-gray-200" />
                            <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border bg-white p-4 space-y-4">
                    <div className="h-11 rounded bg-gray-200" />
                    <div className="h-12 rounded bg-gray-200" />
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-16 rounded bg-gray-200" />
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

const ClientPage = () => {
    const [activeTab, setActiveTab] = useState<TabValue>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const deferredSearchTerm = useDeferredValue(searchTerm.trim())

    const status = activeTab === 'all' ? undefined : activeTab

    const { data, isLoading, isError } = useQuery({
        queryKey: ['clients', 'summary', { currentPage, status, search: deferredSearchTerm }],
        queryFn: () =>
            getClientsSummary({
                pagination: true,
                page: currentPage,
                limit: PAGE_SIZE,
                status,
                search: deferredSearchTerm || undefined,
            }),
        placeholderData: keepPreviousData,
    })

    const result = data?.result
    const summary = data?.summary
    const meta = result?.meta
    const records = result?.records ?? []
    const derivedPageCount = Math.ceil((meta?.totalCount ?? 0) / (meta?.perPage ?? PAGE_SIZE))
    const pageCount = Math.max(derivedPageCount, 1)

    const metrics = useMemo(() => {
        const suspendedAndBanned = (summary?.suspendedClients ?? 0) + (summary?.bannedClients ?? 0)

        return [
            {
                title: 'Total clients',
                value: formatNumber(summary?.totalClients ?? meta?.totalCount ?? 0),
                indicator: { type: 'text' as const, text: `${summary?.thisMonthClients ?? 0} this month`, tone: 'success' as const },
                icon: <FaUsers className="w-5 h-5" />,
                color: 'bg-blue-100 text-blue-600',
            },
            {
                title: 'Active accounts',
                value: formatNumber(summary?.activeAccounts ?? 0),
                indicator: { type: 'text' as const, text: 'Live', tone: 'success' as const },
                icon: <FaCheckCircle className="w-5 h-5" />,
                color: 'bg-green-100 text-green-600',
            },
            {
                title: 'Flagged',
                value: formatNumber(summary?.flaggedClients ?? 0),
                indicator: { type: 'text' as const, text: 'Review', tone: 'warning' as const },
                icon: <FaClock className="w-5 h-5" />,
                color: 'bg-yellow-100 text-yellow-600',
            },
            {
                title: 'Suspended / Banned',
                value: formatNumber(suspendedAndBanned),
                indicator: { type: 'text' as const, text: 'Monitor', tone: 'danger' as const },
                icon: <FaBan className="w-5 h-5" />,
                color: 'bg-red-100 text-red-600',
            },
        ] as const
    }, [meta?.totalCount, summary?.activeAccounts, summary?.bannedClients, summary?.flaggedClients, summary?.suspendedClients, summary?.thisMonthClients, summary?.totalClients])

    const counts: Record<TabValue, number> = {
        all: meta?.totalCount ?? 0,
        ACTIVE: summary?.activeAccounts ?? 0,
        FLAGGED: summary?.flaggedClients ?? 0,
        SUSPENDED: summary?.suspendedClients ?? 0,
        BANNED: summary?.bannedClients ?? 0,
    }

    const handlePageChange = (pageNumber: number) => {
        const nextPage = Math.min(Math.max(pageNumber, 1), pageCount)
        setCurrentPage(nextPage)
    }

    const renderStatusBadge = (statusValue: ClientStatus) => getStatusBadge(statusValue)

    if (isLoading && !data) {
        return <ClientPageSkeleton />
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">
                <div>
                    <h1 className="md:text-xl lg:text-2xl text-lg font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground md:text-sm text-xs mt-1">
                        Manage client accounts, flags and purchase history
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.title} {...metric} />
                    ))}
                </div>

                <div className="bg-white rounded-xl border shadow-sm md:py-2 md:px-4 py-1 px-2">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            setActiveTab(value as TabValue)
                            setCurrentPage(1)
                        }}
                        className="w-full rounded-none"
                    >
                        <div className="w-full overflow-x-auto scrollbar-thin max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                            <TabsList className="bg-transparent px-0 border-b h-auto w-max min-w-full justify-start gap-1 flex-nowrap" variant="line">
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

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-5 w-full mt-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(event) => {
                                    const nextValue = event.target.value
                                    setSearchTerm(nextValue)

                                    if (nextValue.trim() !== searchTerm.trim()) {
                                        setCurrentPage(1)
                                    }
                                }}
                                placeholder="Search firstname, lastname, or email"
                                aria-label="Search clients by firstname, lastname, or email"
                                className="pl-10 bg-white text-xs md:text-sm"
                            />
                        </div>

                        <div className="flex items-center text-muted-foreground font-semibold gap-2">
                            <Button variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
                                <FaArrowDownLong className="md:h-4 md:w-4 h-2 w-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {isError ? (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Unable to load clients right now. Please try again.
                        </div>
                    ) : null}

                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <Table className="text-xs md:text-base">
                            <TableHeader>
                                <TableRow className="text-xs md:text-sm">
                                    <TableHead className="sticky left-0 text-muted-foreground font-semibold bg-white z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                        CLIENT
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">LOCATION</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">ORDERS</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">TOTAL SPENT</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">LAST ACTIVE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">STATUS</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold bg-white z-10">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {records.length > 0 ? (
                                    records.map((client) => {
                                        const fullName = formatClientName(client)
                                        const orderCount = (client._count?.orders ?? 0) + (client._count?.customOrders ?? 0)

                                        return (
                                            <TableRow key={client.id} className="group hover:bg-muted/50 transition-colors">
                                                <TableCell className="sticky left-0 bg-white z-10 group-hover:bg-muted/50 transition-colors after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                                                    <div className="flex items-center gap-1 md:gap-3">
                                                        <div className="md:w-9 md:h-9 w-5 h-5 bg-linear-to-br from-[#1A0089] to-indigo-600 text-white md:text-sm text-[8px] rounded-full flex items-center justify-center font-medium">
                                                            {fullName
                                                                .split(' ')
                                                                .filter(Boolean)
                                                                .map((namePart) => namePart[0])
                                                                .join('')
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="md:text-sm text-[11px]">
                                                            <div className="font-semibold">{fullName}</div>
                                                            <div className="text-muted-foreground">{client.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="font-medium text-muted-foreground md:text-sm text-[11px]">
                                                    <div>—</div>
                                                </TableCell>

                                                <TableCell className="font-bold font-mono md:text-sm text-[11px]">
                                                    <div>{formatNumber(orderCount)}</div>
                                                </TableCell>

                                                <TableCell className="font-bold md:text-sm text-[11px]">{formatCurrency(client.totalAmountPaid)}</TableCell>

                                                <TableCell className="font-medium text-muted-foreground md:text-sm text-[11px]">
                                                    {formatDate(client.lastLogin)}
                                                </TableCell>

                                                <TableCell className="md:text-sm font-semibold text-[11px]">{renderStatusBadge(client.status)}</TableCell>

                                                <TableCell className="bg-white z-10 group-hover:bg-muted/50 transition-colors before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border">
                                                    <div className="flex gap-2 whitespace-nowrap">
                                                        {client.status === 'FLAGGED' ? (
                                                            <>
                                                                <Link href={`/dashboard/clients/${client.id}`}>
                                                                    <Button size="sm" variant="outline" className="text-[#1A0089] hover:text-white hover:bg-[#14006b] border-[#1900894b] cursor-pointer font-medium md:text-xs text-[11px]">
                                                                        View --&gt;
                                                                    </Button>
                                                                </Link>

                                                                <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-100 cursor-pointer font-medium md:text-xs text-[11px]">
                                                                    Ban
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Link href={`/dashboard/clients/${client.id}`}>
                                                                <Button size="sm" variant="outline" className="cursor-pointer">
                                                                    <FaEye className="mr-2" /> View profile
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                                            No clients found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between border-t w-full py-4">
                            <p className="md:text-sm text-xs text-muted-foreground font-medium">
                                Showing {records.length} of {meta?.totalCount ?? 0} clients
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

export default ClientPage