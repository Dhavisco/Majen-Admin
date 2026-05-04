'use client'

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import DesignerProfileTabs from '@/app/dashboard/designers/[id]/DesignerProfileTabs'
import { getDesignerProfile, type DesignerProfile } from '@/lib/api/designers'
import type { Designer, DesignerStatus } from '@/app/dashboard/designers/data'

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

const statusBadgeClass: Record<string, string> = {
    Active: 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20',
    Pending: 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/20',
    Flagged: 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/20',
    Suspended: 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/20',
    Banned: 'bg-red-500/20 text-red-200 hover:bg-red-500/20',
}

function mapStatusToUI(status: string): DesignerStatus {
    const normalized = status.toUpperCase()
    switch (normalized) {
        case 'ACTIVE':
            return 'Active'
        case 'PENDING':
            return 'Pending'
        case 'FLAGGED':
            return 'Flagged'
        case 'SUSPENDED':
            return 'Suspended'
        case 'BANNED':
            return 'Banned'
        default:
            return 'Active'
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
    }).format(date)
}

function mapBusinessType(type: string): 'Ready to wear' | 'Custom' {
    return type.toUpperCase() === 'CUSTOM' ? 'Custom' : 'Ready to wear'
}

function formatCurrency(value: number): string {
    if (value === 0) return '₦0'
    return `₦${(value / 1000).toFixed(1)}K`
}

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



function mapProfileToDesigner(profile: DesignerProfile): Designer {
    const { designer, averageRating, productCount, orderCount, balance } = profile

    return {
        id: designer.id,
        name: `${designer.user.firstName} ${designer.user.lastName}`,
        email: designer.user.email,
        business: designer.businessName,
        type: mapBusinessType(designer.businessType),
        cac: designer.verification.rcNumber,
        products: productCount,
        joined: formatDate(designer.user.createdAt),
        status: mapStatusToUI(designer.status),
        orders: orderCount,
        revenue: formatCurrency(balance.totalBalance),
        rating: averageRating.toFixed(1),
        registeredName: designer.businessName,
        socials: Object.entries(designer.socialLinks)
            .filter(([, value]) => value && value !== 'null')
            .map(([platform, handle]) => {
                const platformMap: Record<string, string> = {
                    instagram: 'IG',
                    facebook: 'FB',
                    tiktok: 'TT',
                    twitter: 'X',
                }
                return {
                    platform: platformMap[platform] || platform,
                    handle: handle as string,
                    url: handle as string,
                }
            }),
        flags: [],
        notes: designer.user.notesReceived.map((note) => ({
            text: note.content,
            meta: `${note.createdBy.firstName} ${note.createdBy.lastName} - ${formatDate(note.createdAt)}`,
        })),
        balance: formatPrice(balance.totalBalance),
        recentMovements: [],
    }
}

function DesignerProfileContent() {
    const params = useParams()
    const id = parseInt(params.id as string, 10)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['designer', 'profile', id],
        queryFn: () => getDesignerProfile(id),
    })

    if (isError) {
        notFound()
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-4 md:space-y-6 md:p-0">
                    <div className="rounded-2xl border bg-[#1A0089] p-4 md:p-6 animate-pulse h-48" />
                    <div className="space-y-4 animate-pulse">
                        <div className="h-96 bg-gray-200 rounded-2xl" />
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!data) return null

    const designer = mapProfileToDesigner(data)

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-[#1A0089] p-4 md:p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-lg sm:text-xl font-semibold">
                                {getInitials(designer.name)}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold uppercase leading-tight wrap-break-word">{designer.name}</h1>
                                <p className="text-white/80 text-xs sm:text-sm mt-1 wrap-break-word">
                                    {designer.business} · {designer.type}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge className={statusBadgeClass[designer.status] ?? 'bg-white/20 text-white hover:bg-white/20'}>{designer.status}</Badge>
                                    {designer.flags.length > 0 && (
                                        <Badge className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/20">
                                            {designer.flags.length} flagged
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:w-auto">
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.products}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Products</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.orders}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Orders</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.revenue}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Revenue</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.rating}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Rating</p>
                            </div>
                        </div>
                    </div>
                </section>

                <DesignerProfileTabs designer={designer} />
            </div>
        </DashboardLayout>
    )
}

export default function DesignerProfilePage() {
    return (
        <Suspense fallback={<div className="p-4 text-muted-foreground">Loading designer profile...</div>}>
            <DesignerProfileContent />
        </Suspense>
    )
}
