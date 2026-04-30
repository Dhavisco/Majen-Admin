'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { FaTiktok, FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import ModerationActionButton, { type ModerationActionType } from '@/app/components/ModerationAction/ModerationActionButton'
import type { Designer } from '@/app/dashboard/designers/data'
import { getDesignerProducts, getDesignerOrders, getDesignerTransactions } from '@/lib/api/designers'
import { formatDate } from '@/hooks/designers/useDesigners'

type DesignerProfileTabsProps = {
    designer: Designer
}

type TabId = 'overview' | 'products' | 'orders' | 'financials' | 'reviews'
type AccountActionTone = 'primary' | 'danger' | 'warning' | 'success' | 'muted'

type AccountAction = {
    label: string
    action: ModerationActionType
    tone: AccountActionTone
    disabled?: boolean
}

const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'financials', label: 'Financials' },
    { id: 'reviews', label: 'Reviews' },
]

const iconByPlatform: Record<string, { Icon: IconType; className: string; iconClassName?: string }> = {
    IG: { Icon: FaInstagram, className: 'bg-gradient-to-br from-amber-400 via-pink-500 to-fuchsia-600 text-white' },
    TT: { Icon: FaTiktok, className: 'bg-black text-white' },
    X: { Icon: FaXTwitter, className: 'bg-black text-white' },
    FB: { Icon: FaFacebookF, className: 'bg-blue-600 text-white' },
}

const toneClassByAction: Record<AccountActionTone, string> = {
    primary: 'bg-[#1A0089] text-white hover:bg-[#14006b] border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
    warning: 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100',
    success: 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    muted: 'border border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-100',
}

const ProductStatusPill = ({ status }: { status: 'Active' | 'Pending review' | 'Rejected' }) => {
    if (status === 'Active') {
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs sm:text-sm font-semibold text-green-700">• Active</span>
    }
    if (status === 'Pending review') {
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs sm:text-sm font-semibold text-amber-700">• Pending review</span>
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs sm:text-sm font-semibold text-red-700">• Rejected</span>
}

const OrderStatusPill = ({ status }: { status: 'Delivered' | 'Processing' | 'Cancelled' | 'Awaiting' }) => {
    const styles: Record<string, string> = {
        Delivered: 'bg-green-50 text-green-700',
        Processing: 'bg-blue-50 text-blue-700',
        Cancelled: 'bg-red-50 text-red-700',
        Awaiting: 'bg-purple-50 text-purple-700',
    }

    return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs sm:text-sm font-semibold ${styles[status]}`}>• {status}</span>
}

function formatPrice(price: string): string {
    const num = parseInt(price, 10)
    if (isNaN(num)) return 'N0'
    return `N${num.toLocaleString()}`
}

function mapProductStatus(status: 'ACTIVE' | 'PENDING' | 'REJECTED'): 'Active' | 'Pending review' | 'Rejected' {
    if (status === 'ACTIVE') return 'Active'
    if (status === 'PENDING') return 'Pending review'
    return 'Rejected'
}

function mapOrderStatus(status: string): 'Delivered' | 'Processing' | 'Cancelled' | 'Awaiting' {
    const normalizedStatus = status.toUpperCase()
    switch (normalizedStatus) {
        case 'CONFIRMED':
            return 'Processing'
        case 'CANCELLED':
            return 'Cancelled'
        default:
            return 'Awaiting'
    }
}

function mapTransactionType(type: string): string {
    const typeMap: Record<string, string> = {
        SETTLEMENT: 'Settlement',
        WITHDRAWAL: 'Withdrawal',
        REFUND: 'Refund',
        DEBIT: 'Debit',
    }
    return typeMap[type.toUpperCase()] || type
}

function mapTransactionDirection(direction: string): 'Credit' | 'Debit' {
    return direction.toUpperCase() === 'CREDIT' ? 'Credit' : 'Debit'
}

function buildProductCountsString(groupCounts: Record<string, number> | undefined): string {
    if (!groupCounts || Object.keys(groupCounts).length === 0) {
        return ''
    }

    const statusLabels: Record<string, string> = {
        ACTIVE: 'active',
        PENDING: 'pending',
        REJECTED: 'rejected',
    }

    return Object.entries(groupCounts)
        .map(([status, count]) => {
            const label = statusLabels[status] || status.toLowerCase()
            return `${count} ${label}`
        })
        .join(' · ')
}

const OrdersSkeleton = () => (
    <div className="animate-pulse space-y-4">
        {[...Array(4)].map((_, index) => (
            <div key={index} className="h-10 bg-gray-200 rounded-md"></div>
        ))}
    </div>
)

export default function DesignerProfileTabs({ designer }: DesignerProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview')
    const [productStatus, setProductStatus] = useState<'ACTIVE' | 'PENDING' | 'REJECTED' | undefined>(undefined)
    const [productPage, setProductPage] = useState(1)
    const productLimit = 10
    const [orderPage, setOrderPage] = useState(1)
    const orderLimit = 10
    const [transactionPage, setTransactionPage] = useState(1)
    const transactionLimit = 10

    const productStatusTabs = useMemo(
        () => [
            { label: 'All', value: undefined },
            { label: 'Active', value: 'ACTIVE' as const },
            { label: 'Pending', value: 'PENDING' as const },
            { label: 'Rejected', value: 'REJECTED' as const },
        ],
        []
    )

    // Keep status counts stable across tab switches using an unfiltered query.
    const { data: productsCountsData } = useQuery({
        queryKey: ['designer', 'products-counts', designer.id],
        queryFn: () => getDesignerProducts(designer.id, { page: 1, limit: 1 }),
    })

    // Fetch designer products
    const { data: productsData } = useQuery({
        queryKey: ['designer', 'products', designer.id, productStatus, productPage],
        queryFn: () => getDesignerProducts(designer.id, { page: productPage, limit: productLimit, status: productStatus }),
    })

    const productMeta = productsData?.meta
    const productPageCount = productMeta?.pageCount ?? 1
    const canPreviousProducts = productPage > 1
    const canNextProducts = productPage < productPageCount

    const statusCounts = useMemo(() => {
        const groupCounts = productsCountsData?.groupProductCountsByStatus ?? {}
        const active = groupCounts.ACTIVE ?? 0
        const pending = groupCounts.PENDING ?? 0
        const rejected = groupCounts.REJECTED ?? 0
        return {
            all: active + pending + rejected,
            active,
            pending,
            rejected,
        }
    }, [productsCountsData?.groupProductCountsByStatus])

    const productRows = useMemo(
        () => (productsData?.records ?? []).map((product) => ({
            id: product.id,
            product: product.title,
            price: formatPrice(product.price),
            stock: product.quantity,
            sales: product.sold,
            status: mapProductStatus(product.status),
        })),
        [productsData?.records]
    )

    const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
        queryKey: ['designer', 'orders', designer.id, orderPage],
        queryFn: () => getDesignerOrders(designer.id, { page: orderPage, limit: orderLimit }),
    })

    const orderMeta = ordersData?.meta
    const orderPageCount = orderMeta?.pageCount ?? 1
    const canPreviousOrders = orderPage > 1
    const canNextOrders = orderPage < orderPageCount

    const orderRows = useMemo(() => {
        if (!ordersData) return [];
        return ordersData.records.map((order) => ({
            id: order.identifier,
            product: order.items[0]?.product.title || 'N/A',
            client: `${order.client.firstName} ${order.client.lastName}`,
            amount: formatPrice(order.price),
            date: formatDate(order.createdAt),
            status: mapOrderStatus(order.status),
        }))
    }, [ordersData])

    const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
        queryKey: ['designer', 'transactions', designer.id, transactionPage],
        queryFn: () => getDesignerTransactions(designer.id, { page: transactionPage, limit: transactionLimit }),
    })

    const transactionMeta = transactionsData?.meta
    const transactionPageCount = transactionMeta?.pageCount ?? 1
    const canPreviousTransactions = transactionPage > 1
    const canNextTransactions = transactionPage < transactionPageCount

    const financialRows = useMemo(() => {
        if (!transactionsData) return [];
        return transactionsData.records.map((transaction) => ({
            id: `transaction-${transaction.id}`,
            date: '', // Will be populated from order/transaction details if available
            description: mapTransactionType(transaction.type),
            type: mapTransactionDirection(transaction.direction),
            amount: `${transaction.direction === 'CREDIT' ? '+' : '-'}N${parseInt(transaction.amount, 10).toLocaleString()}`,
        }))
    }, [transactionsData])

    const reviews = useMemo(
        () => [
            { id: 1, customer: 'Treasure James', product: 'Amara Braided Dress', rating: 5, text: 'Love this dress!' },
            { id: 2, customer: 'Aisha Bello', product: 'Amara Braided Dress', rating: 5, text: 'Beautiful craftsmanship' },
            { id: 3, customer: 'Mary Smith', product: 'Evening Gown', rating: 4, text: 'Great quality' },
        ],
        []
    )

    const accountActions = useMemo<AccountAction[]>(() => {
        switch (designer.status) {
            case 'Pending':
                return [
                    { label: 'Verify account', action: 'verify-account', tone: 'primary' },
                    { label: 'Reject application', action: 'reject-application', tone: 'danger' },
                    { label: 'Flag this account', action: 'flag-account', tone: 'warning' },
                    { label: 'Suspend (verify first)', action: 'suspend-account', tone: 'muted', disabled: true },
                ]
            case 'Banned':
                return [
                    { label: 'Reactivate account', action: 'reactivate-account', tone: 'success' },
                    { label: 'Suspend (already banned)', action: 'suspend-account', tone: 'muted', disabled: true },
                    { label: 'Flag (already banned)', action: 'flag-account', tone: 'muted', disabled: true },
                    { label: 'Verify (resolve ban first)', action: 'verify-account', tone: 'muted', disabled: true },
                ]
            case 'Suspended':
                return [
                    { label: 'Reactivate account', action: 'reactivate-account', tone: 'success' },
                    { label: 'Flag this account', action: 'flag-account', tone: 'warning' },
                    { label: 'Ban account', action: 'ban-account', tone: 'danger' },
                    { label: 'Verify (resolve suspension first)', action: 'verify-account', tone: 'muted', disabled: true },
                ]
            case 'Active':
            case 'Flagged':
            default:
                return [
                    { label: 'Flag this account', action: 'flag-account', tone: 'warning' },
                    { label: 'Suspend account', action: 'suspend-account', tone: 'warning' },
                    { label: 'Ban account', action: 'ban-account', tone: 'danger' },
                    { label: 'Verify (already verified)', action: 'verify-account', tone: 'muted', disabled: true },
                ]
        }
    }, [designer.status])

    return (
        <section className="space-y-4">
            <div className="overflow-x-auto">
                <div className="inline-flex justify-between w-max min-w-full gap-1 rounded-xl border bg-white p-1 sm:min-w-0" role="tablist" aria-label="Designer profile sections">
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
                            <div className="border-b px-3 py-3 sm:px-4 font-semibold">Business information</div>
                            <div className="grid grid-cols-1 gap-4 sm:gap-5 p-3 sm:p-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Registered name</p>
                                    <p className="mt-1 font-semibold">{designer.registeredName}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">CAC RC number</p>
                                    <p className="mt-1 font-semibold">{designer.cac}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Display name</p>
                                    <p className="mt-1 font-semibold">{designer.business}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Business type</p>
                                    <p className="mt-1 font-semibold">{designer.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                                    <p className="mt-1 font-semibold">{designer.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Member since</p>
                                    <p className="mt-1 font-semibold">{designer.joined}</p>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    {designer.socials.map((social) => {
                                        const icon = iconByPlatform[social.platform]
                                        return (
                                            <a key={social.platform + social.handle} href={social.url} className="flex items-center gap-3 text-sm text-[#1A0089] hover:underline break-all">
                                                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${icon?.className ?? 'bg-gray-200 text-gray-700'}`}>
                                                    {icon ? <icon.Icon className={icon.iconClassName ?? 'h-4 w-4'} /> : social.platform}
                                                </span>
                                                {social.handle}
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border bg-white">
                            <div className="border-b px-3 py-3 sm:px-4 font-semibold">Admin notes</div>
                            <div className="space-y-3 p-3 sm:p-4">
                                {designer.notes.map((note, index) => (
                                    <div key={index} className="rounded-lg border bg-gray-50 p-3">
                                        <p className="text-sm font-medium">{note.text}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{note.meta}</p>
                                    </div>
                                ))}
                                <textarea
                                    placeholder="Add a note visible to all admins..."
                                    className="h-24 w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#1A0089]/30"
                                />
                                <Button className="w-full bg-[#1A0089] hover:bg-[#14006b]">Save note</Button>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-4">
                        <div className="overflow-hidden rounded-2xl border bg-white">
                            <div className="flex items-center justify-between border-b px-3 py-3 sm:px-4">
                                <span className="font-semibold">Balance</span>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('financials')}
                                    className="text-xs sm:text-sm font-semibold text-[#1A0089] hover:underline"
                                >
                                    History →
                                </button>
                            </div>
                            <div className="border-b p-3 sm:p-4">
                                <p className="text-sm text-muted-foreground">Current balance</p>
                                <p className="mt-1 text-3xl sm:text-4xl font-bold text-[#1A0089]">{designer.balance}</p>
                            </div>
                            <div className="space-y-2 p-3 sm:p-4">
                                {designer.recentMovements.map((movement, index) => (
                                    <div key={index} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                        <span className="min-w-0 truncate">{movement.label}</span>
                                        <span className={movement.kind === 'credit' ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>{movement.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border bg-white">
                            <div className="border-b px-3 py-3 sm:px-4 font-semibold">Flags ({designer.flags.length})</div>
                            <div className="space-y-2 p-3 sm:p-4">
                                {designer.flags.length === 0 && <p className="text-sm text-muted-foreground">No active flags on this account.</p>}
                                {designer.flags.map((flag, index) => (
                                    <div key={index} className="grid grid-cols-1 gap-2 sm:grid-cols-[70px_1fr_auto] sm:items-center rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                        <span className="text-muted-foreground">{flag.date}</span>
                                        <span>{flag.reason}</span>
                                        <Button size="sm" variant="outline" className="w-full sm:w-auto border-green-300 text-green-700 hover:bg-green-50">Remove</Button>
                                    </div>
                                ))}
                            </div>
                        </div>

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
                                            subject={`${designer.name} · ${designer.business}`}
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

            {activeTab === 'products' && (
                <div id="tab-panel-products" role="tabpanel" aria-labelledby="tab-products" className="overflow-hidden rounded-2xl border bg-white">
                    <div className="flex flex-col justify-between gap-2 border-b px-3 py-3 sm:px-4 sm:py-4 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-base font-semibold">Products ({statusCounts.all || designer.products})</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{buildProductCountsString(productsData?.groupProductCountsByStatus)}</p>
                        </div>
                        <Link href="/dashboard/products" className="text-xs sm:text-sm font-semibold text-[#1A0089] hover:underline">View in Products →</Link>
                    </div>

                    <div className="border-b px-3 sm:px-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {productStatusTabs.map((status) => {
                                const isActive = productStatus === status.value
                                const count =
                                    status.value === undefined
                                        ? statusCounts.all
                                        : status.value === 'ACTIVE'
                                            ? statusCounts.active
                                            : status.value === 'PENDING'
                                                ? statusCounts.pending
                                                : statusCounts.rejected
                                const countColor =
                                    status.value === 'ACTIVE'
                                        ? 'text-green-600 bg-green-50 rounded-full px-2 py-0.5'
                                        : status.value === 'PENDING'
                                            ? 'text-amber-600 bg-amber-50 rounded-full px-2 py-0.5'
                                            : status.value === 'REJECTED'
                                                ? 'text-red-600 bg-red-50 rounded-full px-2 py-0.5'
                                                : 'text-slate-600 bg-slate-50 rounded-full px-2 py-0.5'

                                return (
                                    <button
                                        key={status.label}
                                        onClick={() => {
                                            setProductStatus(status.value)
                                            setProductPage(1)
                                        }}
                                        className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${isActive
                                            ? 'border-[#1A0089] text-[#1A0089]'
                                            : 'border-transparent text-[#97A0AF] hover:text-[#1A0089]'
                                            }`}
                                    >
                                        <span>{status.label}</span>
                                        <span className={`ml-1 text-xs font-bold ${countColor}`}>{count}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <table className="w-full min-w-180 text-left">
                            <thead>
                                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="sticky left-0 z-10 border-r bg-white px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Sales</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productRows.map((row) => (
                                    <tr key={row.id} className="group border-b last:border-b-0 hover:bg-muted/40 transition-colors text-xs sm:text-sm">
                                        <td className="sticky left-0 z-10 border-r bg-white px-4 py-4 font-medium group-hover:bg-muted/40 transition-colors">{row.product}</td>
                                        <td className="px-4 py-4">{row.price}</td>
                                        <td className="px-4 py-4">{row.stock}</td>
                                        <td className="px-4 py-4">{row.sales}</td>
                                        <td className="px-4 py-4"><ProductStatusPill status={row.status} /></td>
                                        <td className="px-4 py-4">
                                            {row.status === 'Pending review' ? (
                                                <div className="flex flex-row sm:items-center gap-2">
                                                    <ModerationActionButton
                                                        action="approve-product"
                                                        subject={row.product}
                                                        buttonLabel="Approve"
                                                        buttonSize="sm"
                                                        buttonClassName="bg-[#1A0089] hover:bg-[#14006b]"
                                                    />
                                                    <ModerationActionButton
                                                        action="reject-product"
                                                        subject={row.product}
                                                        buttonLabel="Reject"
                                                        buttonVariant="outline"
                                                        buttonSize="sm"
                                                        buttonClassName="border-red-300 text-red-600 hover:bg-red-50"
                                                        requireReason
                                                    />
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="outline" className="border-[#B7B1F3] text-[#1A0089] hover:bg-[#F1EFFF]">View</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {productRows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                            No products found for this status.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t px-3 py-4 sm:px-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                            Showing {productRows.length} of {productMeta?.totalCount ?? 0} products
                        </p>

                        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (canPreviousProducts) {
                                                setProductPage((prev) => prev - 1)
                                            }
                                        }}
                                        className={`text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] text-xs border-[0.5px] ${!canPreviousProducts ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        aria-disabled={!canPreviousProducts}
                                    />
                                </PaginationItem>

                                {Array.from({ length: productPageCount }, (_, i) => i + 1).map((pageNum) => (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href="#"
                                            isActive={pageNum === productPage}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setProductPage(pageNum)
                                            }}
                                            className={`${pageNum === productPage
                                                ? 'bg-[#1A0089] text-white! hover:bg-[#14006b]'
                                                : 'text-[#1A0089]! hover:bg-[#1A0089]/10 hover:text-[#14006b]! border-[#1A00894b] border-[0.5px]'
                                                } text-xs cursor-pointer`}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (canNextProducts) {
                                                setProductPage((prev) => prev + 1)
                                            }
                                        }}
                                        className={`text-[#1A0089]! hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] text-xs ${!canNextProducts ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        aria-disabled={!canNextProducts}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div id="tab-panel-orders" role="tabpanel" aria-labelledby="tab-orders" className="overflow-hidden rounded-2xl border bg-white">
                    <div className="border-b px-3 py-3 sm:px-4 sm:py-4">
                        <h3 className="font-semibold">Orders ({ordersData?.meta.totalCount || 0})</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">All orders through this designer</p>
                    </div>

                    {isOrdersLoading ? (
                        <OrdersSkeleton />
                    ) : (
                        <>
                            <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                                <table className="w-full min-w-190 text-left">
                                    <thead>
                                        <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                            <th className="sticky left-0 z-10 border-r bg-white px-4 py-3">Order ID</th>
                                            <th className="px-4 py-3">Product</th>
                                            <th className="px-4 py-3">Client</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderRows.map((row) => (
                                            <tr key={row.id} className="group border-b last:border-b-0 hover:bg-muted/40 transition-colors text-xs sm:text-sm">
                                                <td className="sticky left-0 z-10 border-r bg-white px-4 py-4 group-hover:bg-muted/40 transition-colors">
                                                    <span className="rounded-md border bg-gray-50 px-3 py-1 font-mono text-sm">{row.id}</span>
                                                </td>
                                                <td className="px-4 py-4 font-medium">{row.product}</td>
                                                <td className="px-4 py-4">{row.client}</td>
                                                <td className="px-4 py-4">{row.amount}</td>
                                                <td className="px-4 py-4 text-muted-foreground">{row.date}</td>
                                                <td className="px-4 py-4">
                                                    <OrderStatusPill status={row.status as 'Delivered' | 'Processing' | 'Cancelled' | 'Awaiting'} />
                                                </td>
                                            </tr>
                                        ))}
                                        {orderRows.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                                    No orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col gap-3 border-t px-3 py-4 sm:px-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    Showing {orderRows.length} of {orderMeta?.totalCount ?? 0} orders
                                </p>

                                <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (canPreviousOrders) {
                                                        setOrderPage((prev) => prev - 1)
                                                    }
                                                }}
                                                className={`text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] text-xs border-[0.5px] ${!canPreviousOrders ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                aria-disabled={!canPreviousOrders}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: orderPageCount }, (_, i) => i + 1).map((pageNum) => (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={pageNum === orderPage}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setOrderPage(pageNum)
                                                    }}
                                                    className={`${pageNum === orderPage
                                                        ? 'bg-[#1A0089] text-white! hover:bg-[#14006b]'
                                                        : 'text-[#1A0089]! hover:bg-[#1A0089]/10 hover:text-[#14006b]! border-[#1A00894b] border-[0.5px]'
                                                        } text-xs cursor-pointer`}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (canNextOrders) {
                                                        setOrderPage((prev) => prev + 1)
                                                    }
                                                }}
                                                className={`text-[#1A0089]! hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] text-xs ${!canNextOrders ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                aria-disabled={!canNextOrders}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'financials' && (
                <div id="tab-panel-financials" role="tabpanel" aria-labelledby="tab-financials" className="overflow-hidden rounded-2xl border bg-white">
                    <div className="border-b px-3 py-3 sm:px-4 sm:py-4">
                        <h3 className="font-semibold">Financial history</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Balance: <span className="font-semibold text-[#1A0089]">N{transactionsData?.balance ? parseInt(String(transactionsData.balance), 10).toLocaleString() : designer.balance.replace(/[^\d]/g, '')}</span>
                        </p>
                    </div>

                    {isTransactionsLoading ? (
                        <OrdersSkeleton />
                    ) : (
                        <>
                            <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                                <table className="w-full min-w-170 text-left">
                                    <thead>
                                        <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                            <th className="sticky left-0 z-10 border-r bg-white px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {financialRows.map((row) => (
                                            <tr key={row.id} className="group border-b last:border-b-0 hover:bg-muted/40 transition-colors text-xs sm:text-sm">
                                                <td className="sticky left-0 z-10 border-r bg-white px-4 py-4 text-muted-foreground group-hover:bg-muted/40 transition-colors">{row.date}</td>
                                                <td className="px-4 py-4 font-medium">{row.description}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold ${row.type === 'Credit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                        • {row.type}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-4 text-xs sm:text-sm font-bold ${row.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {row.amount}
                                                </td>
                                            </tr>
                                        ))}
                                        {financialRows.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                                    No transactions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col gap-3 border-t px-3 py-4 sm:px-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    Showing {financialRows.length} of {transactionMeta?.totalCount ?? 0} transactions
                                </p>

                                <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (canPreviousTransactions) {
                                                        setTransactionPage((prev) => prev - 1)
                                                    }
                                                }}
                                                className={`text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] text-xs border-[0.5px] ${!canPreviousTransactions ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                aria-disabled={!canPreviousTransactions}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: transactionPageCount }, (_, i) => i + 1).map((pageNum) => (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={pageNum === transactionPage}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setTransactionPage(pageNum)
                                                    }}
                                                    className={`${pageNum === transactionPage
                                                        ? 'bg-[#1A0089] text-white! hover:bg-[#14006b]'
                                                        : 'text-[#1A0089]! hover:bg-[#1A0089]/10 hover:text-[#14006b]! border-[#1A00894b] border-[0.5px]'
                                                        } text-xs cursor-pointer`}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (canNextTransactions) {
                                                        setTransactionPage((prev) => prev + 1)
                                                    }
                                                }}
                                                className={`text-[#1A0089]! hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] text-xs ${!canNextTransactions ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                aria-disabled={!canNextTransactions}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div id="tab-panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" className="overflow-hidden rounded-2xl border bg-white">
                    <div className="border-b px-3 py-3 sm:px-4 sm:py-4">
                        <h3 className="font-semibold">Reviews (150)</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">4.9 average rating</p>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <table className="w-full min-w-190 text-left">
                            <thead>
                                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="sticky left-0 z-10 border-r bg-white px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Rating</th>
                                    <th className="px-4 py-3">Review</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.id} className="group border-b last:border-b-0 hover:bg-muted/40 transition-colors text-xs sm:text-sm">
                                        <td className="sticky left-0 z-10 border-r bg-white px-4 py-4 font-medium group-hover:bg-muted/40 transition-colors">{review.customer}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{review.product}</td>
                                        <td className="px-4 py-4 text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                                        <td className="px-4 py-4 italic text-slate-700">&quot;{review.text}&quot;</td>
                                        <td className="px-4 py-4">
                                            <ModerationActionButton
                                                action="remove-review"
                                                subject={`review #${review.id}`}
                                                buttonLabel="Remove"
                                                buttonVariant="outline"
                                                buttonSize="sm"
                                                buttonClassName="border-red-300 text-red-600 hover:bg-red-50"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    )
}
