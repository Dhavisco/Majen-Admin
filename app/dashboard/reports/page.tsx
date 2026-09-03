'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FaCheckCircle, FaClock, FaRegFlag, FaShieldAlt } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout';
import MetricCard from '@/app/components/MetricCard/MetricCard';
import { getFlaggedReviews, getOpenReports, getReportsSummary } from '@/lib/api/reports';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

function formatPerson(person: { firstName: string; lastName: string }) {
    return `${person.firstName} ${person.lastName}`.trim();
}

// function formatReason(reason: string) {
//     const trimmedReason = reason.trim();

//     return trimmedReason.length > 0 ? trimmedReason : 'Unspecified';
// }

// function getReasonTone(reason: string) {
//     const normalizedReason = reason.toLowerCase();

//     if (normalizedReason.includes('abuse') || normalizedReason.includes('harass')) {
//         return 'bg-rose-100 text-rose-600';
//     }

//     if (normalizedReason.includes('scam') || normalizedReason.includes('fraud')) {
//         return 'bg-orange-100 text-orange-600';
//     }

//     if (normalizedReason.includes('delay')) {
//         return 'bg-amber-100 text-amber-700';
//     }

//     return 'bg-slate-100 text-slate-600';
// }

function getStatusTone(status: string) {
    const normalized = status.toUpperCase()

    if (normalized === 'RESOLVED') {
        return 'bg-[#F0FDF4] border border-[#FFFFFF33] text-[#16A34A]'
    }

    if (normalized === 'OPEN') {
        return 'bg-[#FFFBEB] border border-[#FFFFFF33] text-[#D97706]'
    }

    return 'bg-slate-100 text-slate-600'
}
function getStatusLabel(status: string) {
    const normalized = status.toUpperCase()
    if (normalized === 'RESOLVED') return 'Resolved'
    if (normalized === 'OPEN') return 'Open'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}



const ReportPage: React.FC = () => {
    const summaryQuery = useQuery({
        queryKey: ['reports', 'summary'],
        queryFn: getReportsSummary,
    });

    const [openReportsPage, setOpenReportsPage] = useState(1)
    const openReportsLimit = 10

    const openReportsQuery = useQuery({
        queryKey: ['reports', 'open', openReportsPage, openReportsLimit],
        queryFn: () => getOpenReports(openReportsLimit, openReportsPage),
    })

    const openReportsData = openReportsQuery.data
    const openReports = openReportsData?.records ?? []
    const openReportsMeta = openReportsData?.meta

    const openReporttotalCount = openReportsMeta?.totalCount ?? 0
    const openReportsPerPage = openReportsMeta?.perPage ?? openReportsLimit
    const openReportsTotalPages = Math.ceil(openReporttotalCount / openReportsPerPage)

    const canPreviousReports = openReportsPage > 1
    const canNextReports = openReportsPage < openReportsTotalPages


    const [flaggedReviewsPage, setFlaggedReviewsPage] = useState(1)
    const flaggedReviewsLimit = 10

    const flaggedReviewsQuery = useQuery({
        queryKey: ['reports', 'flagged-reviews', flaggedReviewsPage, flaggedReviewsLimit],
        queryFn: () => getFlaggedReviews(flaggedReviewsLimit, flaggedReviewsPage),
    })

    const flaggedReviewsData = flaggedReviewsQuery.data
    const flaggedReviews = flaggedReviewsData?.records ?? []
    const flaggedReviewsMeta = flaggedReviewsData?.meta

    const flaggedReviewstotalCount = flaggedReviewsMeta?.totalCount ?? 0
    const flaggedReviewsperPage = flaggedReviewsMeta?.perPage ?? flaggedReviewsLimit
    const totalPages = Math.ceil(flaggedReviewstotalCount / flaggedReviewsperPage)

    const canPreviousFlagged = flaggedReviewsPage > 1
    const canNextFlagged = flaggedReviewsPage < totalPages



    const summary = summaryQuery.data;

    // console.log('Open Reports:', openReports);
    // console.log('Flagged Reviews:', flaggedReviews);

    const metrics = [
        {
            title: 'Open reports',
            value: summary?.total ?? 0,
            indicator: { type: 'text' as const, text: 'All incoming reports', tone: 'warning' },
            icon: <FaShieldAlt className="w-5 h-5" />,
            color: 'bg-yellow-100 text-yellow-600',
        },
        {
            title: 'Flagged reviews',
            value: summary?.flaggedReviews ?? 0,
            indicator: { type: 'text' as const, text: 'Needs attention', tone: 'danger' },
            icon: <FaRegFlag className="w-5 h-5" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Resolved this month',
            value: summary?.resolvedThisMonth ?? 0,
            indicator: { type: 'percentage' as const, value: summary?.growth ?? 0 },
            icon: <FaCheckCircle className="w-5 h-5" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Growth',
            value: `${summary?.growth ?? 0}%`,
            indicator: { type: 'text' as const, text: 'vs last month', tone: 'neutral' },
            icon: <FaClock className="w-5 h-5" />,
            color: 'bg-purple-100 text-purple-600',
        },
    ] as const;

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight md:text-xl lg:text-2xl">Reports & Moderation</h1>
                        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                            Flagged content, disputes and reported accounts requiring review
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric, index) => (
                        <MetricCard key={`${metric.title}-${index}`} {...metric} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border bg-white">
                        <div className="border-b px-3 py-2">
                            <h3 className="text-sm font-bold tracking-tight md:text-lg">Open reports</h3>
                        </div>

                        <Table className="text-xs md:text-sm">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-semibold text-muted-foreground">REPORTER</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">AGAINST</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">STATUS</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">ACTION</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {openReportsQuery.isLoading ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <TableRow key={`open-report-skeleton-${index}`}>
                                            <TableCell colSpan={4}>
                                                <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : openReports.length > 0 ? (
                                    openReports.map((item) => {
                                        // const tone = getReasonTone(item.reason);

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{formatPerson(item.reporter)}</TableCell>
                                                <TableCell className="font-medium">{formatPerson(item.reportedUser)}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${getStatusTone(item.status)}`}>
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {getStatusLabel(item.status)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/dashboard/reports/${item.id}`} className="text-white">
                                                        <Button size="xs" className="bg-[#1A0089] text-white px-4 font-semibold cursor-pointer hover:text-white hover:bg-[#14006b]">
                                                            Review
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                            No open reports found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between border-t px-3 py-4">
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                Showing {openReports.length} of {openReportsMeta?.totalCount ?? 0} reports
                            </p>

                            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (canPreviousReports) {
                                                    setOpenReportsPage((prev) => prev - 1)
                                                }
                                            }}
                                            className={`text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] text-xs border-[0.5px] ${!canPreviousReports ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                }`}
                                            aria-disabled={!canPreviousReports}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: openReportsTotalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                href="#"
                                                isActive={pageNum === openReportsPage}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setOpenReportsPage(pageNum)
                                                }}
                                                className={`${pageNum === openReportsPage
                                                    ? 'bg-[#1A0089] text-white! hover:bg-[#14006b]'
                                                    : 'text-[#1A0089]! hover:text-[#1A0089]/10 border-[#1A00894b] border-[0.5px]'
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
                                                if (canNextReports) {
                                                    setOpenReportsPage((prev) => prev + 1)
                                                }
                                            }}
                                            className={`text-[#1A0089]! hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] text-xs ${!canNextReports ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                }`}
                                            aria-disabled={!canNextReports}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>

                    </div>

                    <div className="overflow-hidden rounded-xl border bg-white">
                        <div className="border-b px-3 py-2">
                            <h3 className="text-sm font-bold tracking-tight md:text-lg">Flagged reviews</h3>
                        </div>

                        <Table className="text-xs md:text-sm">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">

                                    <TableHead className="font-semibold text-muted-foreground">REPORTER</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">REVIEW</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">STATUS</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">ACTION</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {flaggedReviewsQuery.isLoading ? (
                                    Array.from({ length: 2 }).map((_, index) => (
                                        <TableRow key={`flagged-review-skeleton-${index}`}>
                                            <TableCell colSpan={4}>
                                                <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : flaggedReviews.length > 0 ? (
                                    flaggedReviews.map((item) => (
                                        <TableRow key={item.id}>

                                            <TableCell className="font-medium">{formatPerson(item.reporter)}</TableCell>
                                            <TableCell className="font-medium italic text-gray-600">{item.review.description}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${getStatusTone(item.status)}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/dashboard/reports/reviews/${item.review.id}`}>
                                                    <Button
                                                        size="xs"
                                                        variant="outline"
                                                        className="bg-[#1A0089] text-white px-4 font-semibold cursor-pointer hover:text-white hover:bg-[#14006b]">
                                                        Review
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                            No flagged reviews found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between border-t px-3 py-4">
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                Showing {flaggedReviews.length} of {flaggedReviewsMeta?.totalCount ?? 0} flagged reviews
                            </p>

                            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (canPreviousFlagged) setFlaggedReviewsPage((prev) => prev - 1)
                                            }}
                                            aria-disabled={!canPreviousFlagged}
                                            className={`text-[#1A0089]! hover:text-[#14006b] border-[#1A00894b] text-xs border-[0.5px] ${!canPreviousFlagged ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                }`}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                href="#"
                                                isActive={pageNum === flaggedReviewsPage}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setFlaggedReviewsPage(pageNum)
                                                }}
                                                className={`${pageNum === flaggedReviewsPage
                                                    ? 'bg-[#1A0089] text-white! hover:bg-[#14006b]'
                                                    : 'text-[#1A0089]! hover:text-[#1A0089]/10 border-[#1A00894b] border-[0.5px]'
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
                                                if (canNextFlagged) setFlaggedReviewsPage((prev) => prev + 1)
                                            }}
                                            aria-disabled={!canNextFlagged}
                                            className={`text-[#1A0089]! hover:text-[#14006b]! border-[#1A00894b] border-[0.5px] text-xs ${!canNextFlagged ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                }`}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>


                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportPage;