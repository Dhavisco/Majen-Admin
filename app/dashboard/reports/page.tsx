'use client';

import React from 'react';
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

function formatPerson(person: { firstName: string; lastName: string }) {
    return `${person.firstName} ${person.lastName}`.trim();
}

function formatReason(reason: string) {
    const trimmedReason = reason.trim();

    return trimmedReason.length > 0 ? trimmedReason : 'Unspecified';
}

function getReasonTone(reason: string) {
    const normalizedReason = reason.toLowerCase();

    if (normalizedReason.includes('abuse') || normalizedReason.includes('harass')) {
        return 'bg-rose-100 text-rose-600';
    }

    if (normalizedReason.includes('scam') || normalizedReason.includes('fraud')) {
        return 'bg-orange-100 text-orange-600';
    }

    if (normalizedReason.includes('delay')) {
        return 'bg-amber-100 text-amber-700';
    }

    return 'bg-slate-100 text-slate-600';
}

const ReportPage: React.FC = () => {
    const summaryQuery = useQuery({
        queryKey: ['reports', 'summary'],
        queryFn: getReportsSummary,
    });

    const openReportsQuery = useQuery({
        queryKey: ['reports', 'open', 1, 10],
        queryFn: () => getOpenReports(10, 1),
    });

    const flaggedReviewsQuery = useQuery({
        queryKey: ['reports', 'flagged-reviews', 1, 10],
        queryFn: () => getFlaggedReviews(10, 1),
    });

    const summary = summaryQuery.data;
    const openReports = openReportsQuery.data ?? [];
    const flaggedReviews = flaggedReviewsQuery.data ?? [];

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
                                    <TableHead className="font-semibold text-muted-foreground">REASON</TableHead>
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
                                        const tone = getReasonTone(item.reason);

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{formatPerson(item.reporter)}</TableCell>
                                                <TableCell className="font-medium">{formatPerson(item.reportedUser)}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${tone}`}>
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {formatReason(item.reason)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="xs" className="bg-[#1A0089] px-4 font-semibold hover:bg-[#14006b]">
                                                        Review
                                                    </Button>
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
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-white">
                        <div className="border-b px-3 py-2">
                            <h3 className="text-sm font-bold tracking-tight md:text-lg">Flagged reviews</h3>
                        </div>

                        <Table className="text-xs md:text-sm">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-semibold text-muted-foreground">REVIEW</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">REPORTER</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">AGAINST</TableHead>
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
                                            <TableCell className="font-medium italic text-gray-600">{item.review.description}</TableCell>
                                            <TableCell className="font-medium">{formatPerson(item.reporter)}</TableCell>
                                            <TableCell className="font-medium">{formatPerson(item.reportedUser)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="xs"
                                                    variant="outline"
                                                    className="border-red-300 px-4 font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    Remove
                                                </Button>
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
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportPage;