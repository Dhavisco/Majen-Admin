'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import ModerationActionButton, { type ModerationActionType } from '@/app/components/ModerationAction/ModerationActionButton'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getClientOrders, type ClientDetail, type ClientOrderRecord } from '@/lib/api/clients'

type ClientProfileTabsProps = {
    client: ClientDetail
    clientId: number
}

type TabId = 'overview' | 'orders'
type AccountActionTone = 'primary' | 'danger' | 'warning' | 'success' | 'muted'

type AccountAction = {
    label: string
    action: ModerationActionType
    tone: AccountActionTone
    disabled?: boolean
}

const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
]

const ORDER_PAGE_SIZE = 10

const toneClassByAction: Record<AccountActionTone, string> = {
    primary: 'bg-[#1A0089] text-white hover:bg-[#14006b] border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
    warning: 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100',
    success: 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    muted: 'border border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-100',
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

const getOrderStatusTone = (status: string) => {
    const normalized = status.toUpperCase()

    switch (normalized) {
        case 'DELIVERED':
            return 'bg-green-50 text-green-700'
        case 'CONFIRMED':
            return 'bg-emerald-50 text-emerald-700'
        case 'IN_PROGRESS':
        case 'PROCESSING':
            return 'bg-violet-50 text-violet-700'
        case 'SHIPPED':
            return 'bg-sky-50 text-sky-700'
        case 'CANCELLED':
            return 'bg-red-50 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const getOrderStatusLabel = (status: string) => {
    const normalized = status.toUpperCase()

    switch (normalized) {
        case 'IN_PROGRESS':
        case 'PROCESSING':
            return 'In Progress'
        case 'SHIPPED':
            return 'Shipped'
        case 'DELIVERED':
            return 'Delivered'
        case 'CANCELLED':
            return 'Cancelled'
        case 'CONFIRMED':
            return 'Confirmed'
        default:
            return status
    }
}

const OrderStatusPill = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs sm:text-sm font-semibold ${getOrderStatusTone(status)}`}>
        • {getOrderStatusLabel(status)}
    </span>
)

export default function ClientProfileTabs({ client, clientId }: ClientProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview')
    const [currentPage, setCurrentPage] = useState(1)

    const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['clients', 'orders', clientId, currentPage],
        queryFn: () => getClientOrders(clientId, { page: currentPage, limit: ORDER_PAGE_SIZE, pagination: true }),
        placeholderData: keepPreviousData,
        enabled: Number.isFinite(clientId),
    })

    const orders = ordersData?.records ?? []
    const orderMeta = ordersData?.meta
    const pageCount = Math.max(Math.ceil((orderMeta?.totalCount ?? 0) / (orderMeta?.perPage ?? ORDER_PAGE_SIZE)), 1)

    const fullName = `${client.firstName} ${client.lastName}`.trim() || '—'
    const notes = client.notesReceived ?? []

    const accountActions = useMemo<AccountAction[]>(() => {
        switch (client.status) {
            case 'BANNED':
                return [
                    { label: 'Reactivate account', action: 'reactivate-account', tone: 'success' },
                    { label: 'Suspend (already banned)', action: 'suspend-account', tone: 'muted', disabled: true },
                    { label: 'Flag (already banned)', action: 'flag-account', tone: 'muted', disabled: true },
                    { label: 'Verify (resolve ban first)', action: 'verify-account', tone: 'muted', disabled: true },
                ]
            case 'SUSPENDED':
                return [
                    { label: 'Reactivate account', action: 'reactivate-account', tone: 'success' },
                    { label: 'Flag this account', action: 'flag-account', tone: 'warning' },
                    { label: 'Ban account', action: 'ban-account', tone: 'danger' },
                    { label: 'Verify (resolve suspension first)', action: 'verify-account', tone: 'muted', disabled: true },
                ]
            case 'FLAGGED':
                return [
                    { label: 'Flag this account', action: 'flag-account', tone: 'warning' },
                    { label: 'Suspend account', action: 'suspend-account', tone: 'warning' },
                    { label: 'Ban account', action: 'ban-account', tone: 'danger' },
                    { label: 'Verify (already verified)', action: 'verify-account', tone: 'muted', disabled: true },
                ]
            case 'ACTIVE':
            default:
                return [
                    { label: 'Flag this account', action: 'flag-account', tone: 'warning' },
                    { label: 'Suspend account', action: 'suspend-account', tone: 'warning' },
                    { label: 'Ban account', action: 'ban-account', tone: 'danger' },
                    { label: 'Verify (already verified)', action: 'verify-account', tone: 'muted', disabled: true },
                ]
        }
    }, [client.status])

    return (
        <section className="space-y-4">
            <div className="overflow-x-auto">
                <div className="inline-flex w-max min-w-full gap-1 rounded-xl border bg-white p-1 sm:min-w-0" role="tablist" aria-label="Client profile sections">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                role="tab"
                                type="button"
                                aria-selected={isActive}
                                aria-controls={`tab-panel-${tab.id}`}
                                id={`tab-${tab.id}`}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap rounded-lg px-2 py-2 text-xs sm:px-4 sm:text-sm font-semibold transition-colors ${isActive ? 'bg-[#F1EFFF] text-[#1A0089]' : 'text-[#97A0AF] hover:text-[#1A0089]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {activeTab === 'overview' && (
                <div id="tab-panel-overview" role="tabpanel" aria-labelledby="tab-overview" className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <section className="space-y-4 xl:col-span-2">
                        <div className="overflow-hidden rounded-2xl border bg-white">
                            <div className="border-b px-3 py-3 sm:px-4 font-semibold">Client Information</div>
                            <div className="grid grid-cols-1 gap-4 sm:gap-5 p-3 sm:p-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Full name</p>
                                    <p className="mt-1 font-semibold">{fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                                    <p className="mt-1 font-semibold">{client.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Member since</p>
                                    <p className="mt-1 font-semibold">{formatDate(client.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                                    <p className="mt-1 font-semibold">{client.status}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border bg-white">
                            <div className="border-b px-3 py-3 sm:px-4 font-semibold">Admin notes</div>
                            <div className="space-y-3 p-3 sm:p-4">
                                {notes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No notes received for this client yet.</p>
                                ) : (
                                    notes.map((note, index) => (
                                        <div key={`${note.createdAt}-${index}`} className="rounded-lg border bg-gray-50 p-3">
                                            <p className="text-sm font-medium">{note.content}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {note.createdBy.firstName} {note.createdBy.lastName} - {formatDate(note.createdAt)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-4">
                        <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50/30">
                            <div className="border-b border-red-200 px-3 py-3 sm:px-4">
                                <p className="font-semibold text-red-700">Account actions</p>
                                <p className="mt-1 text-xs text-red-600">Changes take effect immediately</p>
                            </div>
                            <div className="space-y-2 p-3 sm:p-4">
                                {accountActions.map((action) => {
                                    return (
                                        <ModerationActionButton
                                            key={action.label}
                                            action={action.action}
                                            subject={fullName}
                                            buttonLabel={action.label}
                                            buttonSize="default"
                                            disabled={action.disabled}
                                            buttonClassName={`w-full justify-start ${toneClassByAction[action.tone]}`}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {activeTab === 'orders' && (
                <div id="tab-panel-orders" role="tabpanel" aria-labelledby="tab-orders" className="overflow-hidden rounded-2xl border bg-white">
                    <div className="border-b px-3 py-3 sm:px-4 sm:py-4">
                        <h3 className="font-semibold">Orders ({orderMeta?.totalCount ?? 0})</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">All orders placed by this customer</p>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin w-full max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <table className="w-full min-w-225 text-left">
                            <thead>
                                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="sticky left-0 z-10 border-r bg-white px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Designer</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingOrders && orders.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-8 text-sm text-muted-foreground" colSpan={6}>
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-8 text-sm text-muted-foreground" colSpan={6}>
                                            No orders found for this client.
                                        </td>
                                    </tr>
                                ) : orders.map((order: ClientOrderRecord) => (
                                    <tr key={order.id} className="group border-b last:border-b-0 hover:bg-muted/40 transition-colors text-xs sm:text-sm">
                                        <td className="sticky left-0 z-10 border-r bg-white px-4 py-4 group-hover:bg-muted/40 transition-colors">
                                            <Link href={`/dashboard/orders/${order.id}`} className="rounded-md border bg-gray-50 px-3 py-1 font-mono text-sm hover:border-[#1A0089]/30 hover:text-[#1A0089]">
                                                {order.identifier}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4 font-medium">{order.items[0]?.product.title ?? '—'}</td>
                                        <td className="px-4 py-4">
                                            {order.creator.user.firstName} {order.creator.user.lastName}
                                        </td>
                                        <td className="px-4 py-4">{formatCurrency(order.price)}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                                        <td className="px-4 py-4"><OrderStatusPill status={order.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {pageCount > 1 ? (
                            <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Showing {orders.length} of {orderMeta?.totalCount ?? 0} orders
                                </p>

                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    if (currentPage > 1) setCurrentPage((value) => value - 1)
                                                }}
                                                aria-disabled={currentPage <= 1}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                                            <PaginationItem key={pageNumber}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={pageNumber === currentPage}
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        setCurrentPage(pageNumber)
                                                    }}
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
                                                    if (currentPage < pageCount) setCurrentPage((value) => value + 1)
                                                }}
                                                aria-disabled={currentPage >= pageCount}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </section>
    )
}
