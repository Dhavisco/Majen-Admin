'use client'

// import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getReportedChatById, type ReportPerson } from '@/lib/api/reports'

const formatPerson = (person?: Partial<ReportPerson> | null) => {
    if (!person) {
        return '—'
    }

    return `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim() || 'Unknown user'
}

const formatDate = (value?: string | null) => {
    if (!value) {
        return '—'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return '—'
    }

    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

const getInitials = (firstName?: string, lastName?: string) =>
    `${firstName ?? ''} ${lastName ?? ''}`
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'NA'

const getStatusTone = (status?: string) => {
    const normalized = (status ?? '').toUpperCase()

    if (normalized === 'OPEN') {
        return 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/20'
    }

    if (normalized === 'RESOLVED') {
        return 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20'
    }

    if (normalized === 'PENDING') {
        return 'bg-violet-500/20 text-violet-700 hover:bg-violet-500/20'
    }

    return 'bg-slate-200 text-slate-700 hover:bg-slate-200'
}

const getStatusLabel = (status?: string) => {
    const normalized = (status ?? '').toUpperCase()

    const labels: Record<string, string> = {
        OPEN: 'Open',
        PENDING: 'Pending Review',
        RESOLVED: 'Resolved',
        REVIEWED: 'Reviewed',
        CLOSED: 'Closed',
        FLAGGED: 'Flagged',
        SUSPENDED: 'Suspended',
    }

    return labels[normalized] ?? normalized ?? 'Open'
}

const getReasonTone = (reason?: string) => {
    const normalized = (reason ?? '').toLowerCase()

    if (normalized.includes('harass') || normalized.includes('abuse')) {
        return 'bg-rose-100 text-rose-600'
    }

    if (normalized.includes('scam') || normalized.includes('fraud')) {
        return 'bg-orange-100 text-orange-600'
    }

    if (normalized.includes('delay')) {
        return 'bg-amber-100 text-amber-700'
    }

    return 'bg-slate-100 text-slate-600'
}

function ReportDetailSkeleton() {
    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0 animate-pulse">
                <div className="flex items-center justify-between gap-3 border-b pb-3">
                    <div className="h-4 w-40 rounded bg-gray-200" />
                    <div className="flex gap-2">
                        <div className="h-9 w-28 rounded bg-gray-200" />
                        <div className="h-9 w-28 rounded bg-gray-200" />
                    </div>
                </div>

                <section className="overflow-hidden rounded-xl border bg-white">
                    <div className="border-b px-4 py-4">
                        <div className="h-4 w-36 rounded bg-gray-200" />
                        <div className="mt-3 h-8 w-56 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[1fr_300px]">
                        <div className="space-y-4">
                            <div className="h-40 rounded-xl border bg-gray-100" />
                            <div className="h-32 rounded-xl border bg-gray-100" />
                        </div>

                        <div className="space-y-4">
                            <div className="h-48 rounded-xl border bg-gray-100" />
                            <div className="h-28 rounded-xl border bg-gray-100" />
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}

export default function ReportDetailPage() {
    const params = useParams()
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id

    if (!rawId) {
        notFound()
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['reports', 'detail', rawId],
        queryFn: () => getReportedChatById(rawId),
        enabled: Boolean(rawId),
    })

    if (isError) {
        notFound()
    }

    if (isLoading || !data) {
        return <ReportDetailSkeleton />
    }

    const report = data.report
    const reporterName = formatPerson(report.reporter)
    const reportedUserName = formatPerson(report.reportedUser)
    const statusTone = getStatusTone(report.status)
    const statusLabel = getStatusLabel(report.status)

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">
                <div className="flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-2xl font-bold">Flagged Review</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Filed by {reporterName} | Submitted {formatDate(report.createdAt)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                            Resolve Report
                        </Button>
                        <Button size="sm" className="bg-[#1A0089] hover:bg-[#14006b]">
                            Flag User
                        </Button>
                    </div>
                </div>

                <section className="overflow-hidden rounded-xl border bg-white">
                    <div className="border-b px-4 py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-lg font-bold">Chat Report</p>
                                <h1 className="mt-2 text-base font-bold text-[#1A0089]">{report.identifier}</h1>

                            </div>

                            <Badge className={statusTone}>{statusLabel}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-xl bg-white">
                                <div className="">
                                    {/* <h2 className="text-base font-semibold">Report Information</h2> */}
                                </div>

                                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Reporter</p>
                                        <p className="mt-2 font-semibold">{reporterName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Against</p>
                                        <p className="mt-2 font-semibold">{reportedUserName}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Reason</p>
                                        <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getReasonTone(report.reason)}`}>
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {report.reason || 'Unspecified'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Submitted</p>
                                        <p className="mt-2 font-semibold">{formatDate(report.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Last updated</p>
                                        <p className="mt-2 font-semibold">{formatDate(report.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border bg-white">
                                <div className="border-b px-4 py-3">
                                    <h3 className="text-base font-semibold">Prior reports</h3>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-slate-700">{data.priorReportsCount} prior reports filed</p>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border bg-white">
                                <div className="border-b px-4 py-3">
                                    <h3 className="text-base font-semibold">Admin notes</h3>
                                </div>
                                <div className="space-y-3 p-4">
                                    <div className="rounded-xl border bg-slate-50 px-3 py-3 text-sm text-slate-700">
                                        {report.notes || 'No admin note has been added for this report yet.'}
                                    </div>
                                    <Button variant="outline" className="border-[#1A0089] text-[#1A0089] hover:bg-[#1A0089]/5">
                                        Save note
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <div className="overflow-hidden rounded-xl border bg-white">
                                <div className="border-b px-4 py-3">
                                    <h3 className="text-base font-semibold">Report Moderation</h3>
                                </div>
                                <div className="space-y-3 p-4 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Report status</span>
                                        <Badge className={statusTone}>{statusLabel}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Last updated</span>
                                        <span className="font-semibold">{formatDate(report.updatedAt)}</span>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <Button className="w-full bg-[#1A0089] hover:bg-[#14006b]">Resolve Report</Button>
                                        <Button variant="destructive" className="w-full hover:bg-red-600">Flag User</Button>
                                        <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">Suspend User</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border bg-white">
                                <div className="border-b px-4 py-3">
                                    <h3 className="text-base font-semibold">Reported User</h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E3FF] text-sm font-bold text-[#1A0089]">
                                            {getInitials(report.reportedUser?.firstName, report.reportedUser?.lastName)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{reportedUserName}</p>
                                            <p className="text-sm text-muted-foreground">User #{report.reportedUserId}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}
