'use client'

import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import ModerationActionButton from '@/app/components/ModerationAction/ModerationActionButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { flagUser } from '@/lib/api/designers'
import { getFlaggedReviewById, removeReview, resolveReport, restoreReview, type ReportPerson } from '@/lib/api/reports'

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

    if (labels[normalized]) {
        return labels[normalized]
    }

    return normalized || 'Open'
}

function FlaggedReviewPageSkeleton() {
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
                        <div className="mt-3 h-8 w-52 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-64 rounded bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[1fr_300px]">
                        <div className="space-y-4">
                            <div className="h-48 rounded-xl border bg-gray-100" />
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

export default function FlaggedReviewDetailPage() {
    const params = useParams()
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const queryClient = useQueryClient()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    if (!rawId) {
        notFound();
    }

    const numericId = Number(rawId);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['reports', 'flagged-review', numericId],
        queryFn: () => getFlaggedReviewById(numericId),
        enabled: !isNaN(numericId),
    });

    const resolveMutation = useMutation({
        mutationFn: (id: string) => resolveReport(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['reports'] })
            await queryClient.invalidateQueries({ queryKey: ['reports', 'flagged-review', numericId] })
        },
    })

    const removeMutation = useMutation({
        mutationFn: (id: number) => removeReview(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['reports'] })
            await queryClient.invalidateQueries({ queryKey: ['reports', 'flagged-review', numericId] })
        },
    })

    const restoreMutation = useMutation({
        mutationFn: (id: number) => restoreReview(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['reports'] })
            await queryClient.invalidateQueries({ queryKey: ['reports', 'flagged-review', numericId] })
        },
    })

    const flagMutation = useMutation({
        mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
            flagUser(userId, reason),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['reports'] })
        },
    })

    useEffect(() => {
        if (!successMessage) {
            return
        }

        const timeoutId = window.setTimeout(() => setSuccessMessage(null), 4000)

        return () => window.clearTimeout(timeoutId)
    }, [successMessage])

    if (isError) {
        notFound()
    }

    if (isLoading || !data) {
        return <FlaggedReviewPageSkeleton />
    }

    const review = data?.review
    const report = data?.report

    const reviewerName = formatPerson(review.reviewer)
    // const reportedUserName = formatPerson(report.reportedUser)
    const statusTone = getStatusTone(report.status)
    const statusLabel = getStatusLabel(report.status)

    const isResolved = report.status === 'RESOLVED'




    return (
        <DashboardLayout>
            {successMessage && (
                <div
                    className="fixed right-4 top-4 z-70 max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg"
                    role="status"
                    aria-live="polite"
                >
                    {successMessage}
                </div>
            )}

            <div className="space-y-6 md:p-0">
                <div className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-2xl font-bold">Flagged Review</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Filed by {formatPerson(report.reporter)} | Posted {formatDate(report.createdAt)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <ModerationActionButton
                            action="remove-review"
                            subject={review.identifier}
                            buttonLabel="Remove Review"
                            buttonSize="sm"
                            buttonClassName="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                            disabled={removeMutation.isPending}
                            onSuccess={setSuccessMessage}
                            onConfirm={() => removeMutation.mutateAsync(review.id)}
                        />
                        <ModerationActionButton
                            action="restore-review"
                            subject={review.identifier}
                            buttonLabel="Restore Review"
                            buttonVariant="outline"
                            buttonSize="sm"
                            buttonClassName="border-slate-200 text-[#52525B] hover:bg-slate-50"
                            disabled={restoreMutation.isPending}
                            onSuccess={setSuccessMessage}
                            onConfirm={() => restoreMutation.mutateAsync(review.id)}
                        />
                    </div>
                </div>

                <section className="overflow-hidden rounded-xl bg-white">

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-xl border bg-white">
                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <h2 className="text-base font-semibold">Review Information</h2>
                                    <Badge className={statusTone}>{statusLabel}</Badge>
                                </div>

                                <div className='px-4 py-2'>
                                    <p className="text-lg font-bold ">Flagged Review</p>
                                    <h1 className="text-2xl font-bold text-[#1A0089]">{report.identifier}</h1>
                                    {/* <p className="mt-1 text-sm text-muted-foreground">
                                    Filed by {formatPerson(report.reporter)} | Submitted {formatDate(review.createdAt)}
                                </p> */}
                                </div>

                                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Reviewer</p>
                                        <p className="mt-2 font-semibold">{reviewerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Designer</p>
                                        <p className="mt-2 font-semibold">{review.product.business.displayName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rating</p>
                                        <p className="mt-2 font-semibold text-[#E11D48]">{review?.rating} star</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Submitted</p>
                                        <p className="mt-2 font-semibold">{formatDate(report?.createdAt)}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Reason</p>
                                        <p className="mt-2 font-semibold text-[#E11D48]">{report?.reason || 'Unspecified'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Related order</p>
                                        <p className="mt-2 font-semibold">
                                            #{review.orderItem?.order?.identifier || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border bg-white">
                                <div className="border-b px-4 py-3">
                                    <h3 className="text-xs font-semibold text-muted-foreground">FULL REVIEW</h3>
                                </div>
                                <div className="p-2">
                                    <p className="text-sm italic text-slate-700 font-medium">“{review.description}”</p>
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
                                    <h3 className="text-base font-semibold">Review Moderation</h3>
                                </div>
                                <div className="space-y-3 p-4 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground font-medium">Review status</span>
                                        <Badge className={statusTone}>{statusLabel}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground font-medium">Last updated</span>
                                        <span className="font-semibold">{formatDate(report.updatedAt)}</span>
                                    </div>
                                    <div className="space-y-2 pt-2 font-semibold">

                                        {!isResolved && (
                                            <ModerationActionButton
                                                action="resolve-report"
                                                subject={report.identifier}
                                                buttonLabel="Resolve Flag"
                                                buttonClassName="w-full bg-[#1A0089] hover:bg-[#14006b]"
                                                disabled={resolveMutation.isPending}
                                                onSuccess={setSuccessMessage}
                                                onConfirm={() => resolveMutation.mutateAsync(report.id)}
                                            />
                                        )}
                                        <ModerationActionButton
                                            action="remove-review"
                                            subject={review.identifier}
                                            buttonLabel="Remove Review"
                                            buttonClassName="w-full bg-[#E11D48] text-white hover:bg-[#d01a40]"
                                            disabled={removeMutation.isPending}
                                            onSuccess={setSuccessMessage}
                                            onConfirm={() => removeMutation.mutateAsync(review.id)}
                                        />
                                        <ModerationActionButton
                                            action="restore-review"
                                            subject={review.identifier}
                                            buttonLabel="Restore Review"
                                            buttonClassName="w-full bg-[#16A34A] text-white hover:bg-[#148c3d]"
                                            disabled={restoreMutation.isPending}
                                            onSuccess={setSuccessMessage}
                                            onConfirm={() => restoreMutation.mutateAsync(review.id)}
                                        />
                                        <ModerationActionButton
                                            action="flag-account"
                                            subject={reviewerName}
                                            buttonLabel="Flag Reviewer"
                                            buttonClassName="w-full bg-[#D97706] text-white hover:bg-[#c06a05]"
                                            requireReason
                                            disabled={flagMutation.isPending}
                                            onSuccess={setSuccessMessage}
                                            onConfirm={(reason?: string) => {
                                                if (!reason?.trim()) return
                                                return flagMutation.mutateAsync({ userId: review.reviewer.id, reason: reason.trim() })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border bg-white">
                                <div className="border-b px-4 py-3">
                                    <h3 className="text-base font-semibold">Reviewer</h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E3FF] text-sm font-bold text-[#1A0089]">
                                            {getInitials(review.reviewer?.firstName, review.reviewer?.lastName)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{reviewerName}</p>
                                            <p className="text-sm text-muted-foreground">{review.reviewer._count?.givenReviews ?? 0} reviews written</p>
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
