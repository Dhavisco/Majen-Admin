'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

import ModerationActionButton from '@/app/components/ModerationAction/ModerationActionButton'
import { Button } from '@/components/ui/button'

type OrderDetailActionsProps = {
    orderLabel: string
    currentStatus: string
}

const statusOptions = ['Confirmed', 'In Progress', 'Shipped', 'Delivered'] as const

type StatusOption = (typeof statusOptions)[number]

const mapStatus = (status: string): StatusOption => {
    if (status === 'Delivered') {
        return 'Delivered'
    }

    if (status === 'Processing') {
        return 'In Progress'
    }

    if (status === 'Awaiting') {
        return 'Confirmed'
    }

    return 'Confirmed'
}

export default function OrderDetailActions({ orderLabel, currentStatus }: OrderDetailActionsProps) {
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>(mapStatus(currentStatus))
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) {
                return
            }

            if (!containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    return (
        <div className="flex items-center gap-2 self-start w-full sm:w-auto justify-end">
            <div className="relative" ref={containerRef}>
                <Button
                    type="button"
                    size="sm"
                    onClick={() => setOpen((value) => !value)}
                    className="bg-[#1A0089] hover:bg-[#14006b] text-white"
                >
                    Update Status
                </Button>

                {open && (
                    <div className="absolute left-0 sm:left-auto sm:right-0 top-full z-30 mt-2 w-44 max-w-[calc(100vw-2rem)] max-h-60 overflow-y-auto rounded-lg border bg-white p-1 shadow-lg">
                        {statusOptions.map((status) => {
                            const isSelected = selectedStatus === status

                            return (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => {
                                        setSelectedStatus(status)
                                        setOpen(false)
                                    }}
                                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${isSelected ? 'bg-[#D6D2EC] text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    {isSelected ? <FaCheck className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5" />}
                                    <span>{status}</span>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            <ModerationActionButton
                action="cancel-order"
                subject={orderLabel}
                buttonLabel="Cancel Order"
                buttonVariant="outline"
                buttonSize="sm"
                buttonClassName="border border-red-600 text-red-600 bg-white hover:bg-red-700 hover:text-white"
            />
        </div>
    )
}
