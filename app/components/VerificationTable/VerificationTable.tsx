'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import ModerationActionButton from '@/app/components/ModerationAction/ModerationActionButton';

interface Verification {
    designer: string;
    business: string;
    submitted: string;
    actions: React.ReactNode; // we'll override this actually
}

interface VerificationTableProps {
    data: Omit<Verification, 'actions'>[]; // we'll handle actions inside
}

export default function VerificationTable({ data }: VerificationTableProps) {
    return (
        <div className="rounded-md border bg-white shadow-sm">
            <div className="p-4 pb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pending Verifications</h3>
                <Link href="/dashboard/designers?tab=pending" className="text-blue-800! font-medium hover:underline! cursor-pointer text-sm" > View all → </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-45">Designer</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                        <TableHead className="text-right w-35">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No pending verifications.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => (
                            <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="font-medium truncate max-w-45">
                                    {item.designer}
                                </TableCell>
                                <TableCell className="truncate max-w-50">
                                    {item.business}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-muted-foreground">
                                    {item.submitted}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <ModerationActionButton
                                            action="verify-account"
                                            subject={`${item.designer} · ${item.business}`}
                                            buttonLabel="Verify"
                                            buttonSize="sm"
                                            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white"
                                        />
                                        <ModerationActionButton
                                            action="reject-application"
                                            subject={`${item.designer} · ${item.business}`}
                                            buttonLabel="Reject"
                                            buttonSize="sm"
                                            buttonVariant="destructive"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}