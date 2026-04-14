'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { FaTiktok, FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

import { Button } from '@/components/ui/button'
import ModerationActionButton, { type ModerationActionType } from '@/app/components/ModerationAction/ModerationActionButton'
import type { Designer } from '@/app/dashboard/designers/data'

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

export default function DesignerProfileTabs({ designer }: DesignerProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview')

    const productRows = useMemo(
        () => [
            { id: 1, product: 'Amara Braided Dress', price: 'N100,000', stock: 10, sales: 42, status: 'Active' as const },
            { id: 2, product: 'Zara Dress', price: 'N100,000', stock: 10, sales: 12, status: 'Pending review' as const },
            { id: 3, product: 'Linen Co-ord Set', price: 'N85,000', stock: 10, sales: 8, status: 'Active' as const },
        ],
        []
    )

    const orderRows = useMemo(
        () => [
            { id: '#4821', product: 'Amara Braided Dress', client: 'Treasure James', amount: 'N100,000', date: 'Mar 15', status: 'Delivered' as const },
            { id: '#4820', product: 'Zara Dress', client: 'Aisha Bello', amount: 'N100,000', date: 'Mar 14', status: 'Processing' as const },
            { id: '#4819', product: 'Evening Gown', client: 'Mary Smith', amount: 'N150,000', date: 'Mar 13', status: 'Cancelled' as const },
            { id: '#4818', product: 'Linen Set', client: 'Brenda Thompson', amount: 'N85,000', date: 'Mar 12', status: 'Awaiting' as const },
        ],
        []
    )

    const financialRows = useMemo(() => {
        const movements = designer.recentMovements.map((movement, index) => ({
            id: `${movement.label}-${index}`,
            date: index === 0 ? 'Mar 15' : 'Mar 10',
            description: movement.label,
            type: movement.kind === 'credit' ? 'Credit' : 'Debit',
            amount: movement.amount,
        }))

        return [
            ...movements,
            { id: 'platform-fee', date: 'Mar 14', description: 'Platform fee (10%)', type: 'Debit', amount: '-N15,000' },
        ]
    }, [designer.recentMovements])

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
                            <h3 className="text-base font-semibold">Products ({designer.products})</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">22 active · 1 pending · 2 rejected</p>
                        </div>
                        <Link href="/dashboard/products" className="text-xs sm:text-sm font-semibold text-[#1A0089] hover:underline">View in Products →</Link>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div id="tab-panel-orders" role="tabpanel" aria-labelledby="tab-orders" className="overflow-hidden rounded-2xl border bg-white">
                    <div className="border-b px-3 py-3 sm:px-4 sm:py-4">
                        <h3 className="font-semibold">Orders ({designer.orders})</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">All orders through this designer</p>
                    </div>

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
                                        <td className="sticky left-0 z-10 border-r bg-white px-4 py-4 group-hover:bg-muted/40 transition-colors"><span className="rounded-md border bg-gray-50 px-3 py-1 font-mono text-sm">{row.id}</span></td>
                                        <td className="px-4 py-4 font-medium">{row.product}</td>
                                        <td className="px-4 py-4">{row.client}</td>
                                        <td className="px-4 py-4">{row.amount}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{row.date}</td>
                                        <td className="px-4 py-4"><OrderStatusPill status={row.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'financials' && (
                <div id="tab-panel-financials" role="tabpanel" aria-labelledby="tab-financials" className="overflow-hidden rounded-2xl border bg-white">
                    <div className="border-b px-3 py-3 sm:px-4 sm:py-4">
                        <h3 className="font-semibold">Financial history</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Balance: <span className="font-semibold text-[#1A0089]">{designer.balance}</span></p>
                    </div>

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
                            </tbody>
                        </table>
                    </div>
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
