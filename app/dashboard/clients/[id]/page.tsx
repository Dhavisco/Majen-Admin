'use client'

import { notFound, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { getClientDetails } from '@/lib/api/clients'
import ClientProfileTabs from '@/app/dashboard/clients/[id]/ClientProfileTabs'
import Image from 'next/image'

type ClientPageSkeletonProps = {
    showTabs?: boolean
}

const statusBadgeClass: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20',
    BANNED: 'bg-red-500/20 text-red-200 hover:bg-red-500/20',
    FLAGGED: 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/20',
    SUSPENDED: 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/20',
}

const statusIndicatorColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-400',
    FLAGGED: 'bg-orange-400',
    SUSPENDED: 'bg-yellow-400',
    BANNED: 'bg-red-400',
}

const statusLabel: Record<string, string> = {
    ACTIVE: 'Active',
    FLAGGED: 'Flagged',
    SUSPENDED: 'Suspended',
    BANNED: 'Banned',
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

const getInitials = (firstName: string, lastName: string) =>
    `${firstName} ${lastName}`
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

function ClientPageSkeleton({ showTabs = true }: ClientPageSkeletonProps) {
    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0 animate-pulse">
                <section className="rounded-2xl border bg-[#1A0089] p-4 md:p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white/15" />
                            <div className="space-y-2">
                                <div className="h-6 w-48 rounded bg-white/15" />
                                <div className="h-4 w-64 rounded bg-white/15" />
                                <div className="h-8 w-28 rounded-full bg-white/15" />
                            </div>
                        </div>
                    </div>
                </section>

                {showTabs ? (
                    <div className="space-y-4 rounded-2xl border bg-white p-4">
                        <div className="h-11 w-56 rounded bg-gray-200" />
                        <div className="h-52 rounded bg-gray-200" />
                    </div>
                ) : null}
            </div>
        </DashboardLayout>
    )
}

export default function ClientProfilePage() {
    const params = useParams()
    const rawId = params.id
    const clientId = Number.parseInt(Array.isArray(rawId) ? rawId[0] : rawId ?? '', 10)

    const { data: client, isLoading, isError, refetch } = useQuery({
        queryKey: ['clients', 'detail', clientId],
        queryFn: () => getClientDetails(clientId),
        enabled: Number.isFinite(clientId),
    })

    if (!Number.isFinite(clientId)) {
        notFound()
    }

    if (isLoading && !client) {
        return <ClientPageSkeleton />
    }

    if (isError || !client) {
        return (
            <DashboardLayout>
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-red-700">
                    <p className="font-semibold">Unable to load client details.</p>
                    <p className="mt-1 text-sm">Please try again.</p>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            className="rounded-lg bg-[#1A0089] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14006b]"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    const fullName = `${client.firstName} ${client.lastName}`.trim()

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-[#1A0089] p-4 md:p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3 sm:gap-4">
                            {client.image ? (
                                <Image
                                    src={client.image}
                                    alt={fullName}
                                    width={56}
                                    height={56}
                                    className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-cover ring-2 ring-white/30"
                                />
                                //                                 <img
                                //   src={client.image}
                                //   alt={fullName}
                                //   className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-cover ring-2 ring-white/30"
                                // />
                            ) : (
                                <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-lg sm:text-xl font-semibold">
                                    {getInitials(client.firstName, client.lastName)}
                                </div>
                            )}

                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold uppercase leading-tight wrap-break-word">{fullName}</h1>
                                {/* <p className="text-white/80 text-xs sm:text-sm mt-1 wrap-break-word">{client.email}</p> */}
                                <p className="text-white/70 text-xs sm:text-sm mt-1">Client since {formatDate(client.createdAt)}</p>
                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    <Badge className={statusBadgeClass[client.status] ?? 'bg-white/20 text-white hover:bg-white/20'}>
                                        <span className={`inline-block h-2 w-2 rounded-full ${statusIndicatorColor[client.status] ?? 'bg-white/70'}`} />
                                        {statusLabel[client.status] ?? client.status}
                                    </Badge>
                                    {client.flagsReceived.length > 0 && (
                                        <Badge className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/20">
                                            {client.flagsReceived.length} flagged
                                        </Badge>
                                    )}
                                    {client.suspensionCount > 0 && (
                                        <Badge className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/20">
                                            {client.suspensionCount} suspension{client.suspensionCount > 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <ClientProfileTabs client={client} clientId={clientId} />
            </div>
        </DashboardLayout>
    )
}