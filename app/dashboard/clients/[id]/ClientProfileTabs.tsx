'use client'

import React, { useMemo, useState } from 'react'

// import { Badge } from '@/components/ui/badge'
import ModerationActionButton, { type ModerationActionType } from '@/app/components/ModerationAction/ModerationActionButton'
import { Button } from '@/components/ui/button'
import type { Client } from '@/app/dashboard/clients/data'

type ClientProfileTabsProps = {
    client: Client
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

const toneClassByAction: Record<AccountActionTone, string> = {
    primary: 'bg-[#1A0089] text-white hover:bg-[#14006b] border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
    warning: 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100',
    success: 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    muted: 'border border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-100',
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

export default function ClientProfileTabs({ client }: ClientProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview')

    const orders = useMemo(
        () => [
            { id: '#4821', product: 'Amara Braided Dress', designer: 'Treasure James', amount: 'N100,000', date: 'Mar 15', status: 'Delivered' as const },
            { id: '#4820', product: 'Zara Dress', designer: 'Aisha Bello', amount: 'N100,000', date: 'Mar 14', status: 'Processing' as const },
            { id: '#4819', product: 'Evening Gown', designer: 'Mary Smith', amount: 'N150,000', date: 'Mar 13', status: 'Cancelled' as const },
            { id: '#4818', product: 'Linen Set', designer: 'Brenda Thompson', amount: 'N85,000', date: 'Mar 12', status: 'Awaiting' as const },
        ],
        []
    )

    const accountActions = useMemo<AccountAction[]>(() => {
        switch (client.status) {
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
                                    <p className="mt-1 font-semibold">{client.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                                    <p className="mt-1 font-semibold">{client.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                                    <p className="mt-1 font-semibold">{client.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Location</p>
                                    <p className="mt-1 font-semibold">{client.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Preferred category</p>
                                    <p className="mt-1 font-semibold">{client.preferredCategory}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Member since</p>
                                    <p className="mt-1 font-semibold">{client.joined}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border bg-white">
                            <div className="border-b px-3 py-3 sm:px-4 font-semibold">Admin notes</div>
                            <div className="space-y-3 p-3 sm:p-4">
                                {client.notes.map((note, index) => (
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
                            <div className="border-b px-3 py-3 sm:px-4 font-semibold">Flags ({client.flags.length})</div>
                            <div className="space-y-2 p-3 sm:p-4">
                                {client.flags.length === 0 && <p className="text-sm text-muted-foreground">No active flags on this account.</p>}
                                {client.flags.map((flag, index) => (
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
                                            subject={client.name}
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
                        <h3 className="font-semibold">Orders ({client.orders})</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">All orders placed by this customer</p>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin w-full mt-4 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-10rem)] lg:max-w-full">
                        <table className="w-full min-w-190 text-left">
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
                                {orders.map((order) => (
                                    <tr key={order.id} className="group border-b last:border-b-0 hover:bg-muted/40 transition-colors text-xs sm:text-sm">
                                        <td className="sticky left-0 z-10 border-r bg-white px-4 py-4 group-hover:bg-muted/40 transition-colors">
                                            <span className="rounded-md border bg-gray-50 px-3 py-1 font-mono text-sm">{order.id}</span>
                                        </td>
                                        <td className="px-4 py-4 font-medium">{order.product}</td>
                                        <td className="px-4 py-4">{order.designer}</td>
                                        <td className="px-4 py-4">{order.amount}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{order.date}</td>
                                        <td className="px-4 py-4"><OrderStatusPill status={order.status} /></td>
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
