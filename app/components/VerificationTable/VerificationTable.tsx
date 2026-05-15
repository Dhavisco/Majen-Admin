'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import ModerationActionButton from '../ModerationAction/ModerationActionButton';
import { rejectDesignerVerification, verifyDesigner } from '@/lib/api/designers';

interface Verification {
    id: number;
    designer: string;
    business: string;
    email: string;
    businessType: string;
    submitted: string;
    actions: React.ReactNode; // we'll override this actually
}

interface VerificationTableProps {
    data: Omit<Verification, 'actions'>[]; // we'll handle actions inside
}

export default function VerificationTable({ data }: VerificationTableProps) {
    const queryClient = useQueryClient();

    const verifyMutation = useMutation({
        mutationFn: (id: number) => verifyDesigner(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) => rejectDesignerVerification(id, reason),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <div className="p-4 pb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pending Verifications</h3>
                <Link href="/dashboard/designers?tab=pending" className="text-blue-800! font-medium hover:underline! cursor-pointer text-sm" > View all → </Link>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
                <Table className="min-w-180">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky left-0 text-muted-foreground font-semibold bg-white z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border w-45">Designer</TableHead>
                            <TableHead>Business</TableHead>
                            <TableHead className="">Submitted</TableHead>
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
                                    <TableCell className="sticky left-0 bg-white z-10 font-medium truncate max-w-45 after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">

                                        <div className='flex flex-col gap-1'>
                                            <div className='font-medium'>{item.designer}</div>
                                            <div className='text-gray-600 md:text-sm text-[11px]'>{item.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="truncate max-w-50">
                                        <div className='flex flex-col gap-1'>
                                            <div className='font-medium'>{item.business}</div>
                                            <div className='text-gray-600 text-xs'>{item.businessType}</div>
                                        </div>

                                    </TableCell>
                                    <TableCell className=" text-muted-foreground">
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
                                                onConfirm={() => verifyMutation.mutateAsync(item.id)}
                                                disabled={verifyMutation.isPending || rejectMutation.isPending}
                                            />
                                            <ModerationActionButton
                                                action="reject-application"
                                                subject={`${item.designer} · ${item.business}`}
                                                buttonLabel="Reject"
                                                buttonSize="sm"
                                                buttonVariant="destructive"
                                                onConfirm={(reason: string | undefined) => rejectMutation.mutateAsync({ id: item.id, reason: reason ?? '' })}
                                                disabled={verifyMutation.isPending || rejectMutation.isPending}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}