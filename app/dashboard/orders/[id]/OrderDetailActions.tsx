'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaCheck } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { AxiosError } from 'axios'

import { Button } from '@/components/ui/button'
import { updateOrderStatus, cancelOrder } from '@/lib/api/orders'

type OrderDetailActionsProps = {
    orderId: number
    orderLabel: string
    currentStatus: string
}

const statusOptions = ['Confirmed', 'In Progress', 'Shipped', 'Delivered'] as const
type StatusOption = (typeof statusOptions)[number]

const statusToBackend: Record<StatusOption, 'CONFIRMED' | 'SHIPPED' | 'DELIVERED'> = {
    'Confirmed': 'CONFIRMED',
    'In Progress': 'CONFIRMED',
    'Shipped': 'SHIPPED',
    'Delivered': 'DELIVERED',
}

const mapStatus = (status: string): StatusOption => {
    const normalized = status.toUpperCase()
    if (normalized === 'CONFIRMED') return 'Confirmed'
    if (normalized === 'PENDING' || normalized === 'AWAITING') return 'In Progress'
    if (normalized === 'SHIPPED') return 'Shipped'
    if (normalized === 'DELIVERED') return 'Delivered'
    return 'Confirmed'
}

type ConfirmModalProps = {
    isOpen: boolean
    title: string
    description: string
    confirmLabel: string
    isDangerous?: boolean
    isLoading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

function ConfirmModal({ isOpen, title, description, confirmLabel, isDangerous, isLoading, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex justify-center mb-4">
                    {isDangerous ? (
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <MdClose className="h-6 w-6 text-red-600" />
                        </div>
                    ) : (
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                            <FaCheck className="h-5 w-5 text-emerald-600" />
                        </div>
                    )}
                </div>

                <h2 className="text-center text-lg font-semibold text-gray-900">{title}</h2>
                <p className="mt-3 text-center text-sm text-gray-500">{description}</p>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 font-medium text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 ${
                            isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                    >
                        {isLoading ? 'Loading...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function OrderDetailActions({ orderId, orderLabel, currentStatus }: OrderDetailActionsProps) {
    const queryClient = useQueryClient()
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>(mapStatus(currentStatus))
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
    const [showStatusConfirm, setShowStatusConfirm] = useState(false)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const isCancelled = currentStatus.toUpperCase() === 'CANCELLED'

    const statusMutation = useMutation({
        mutationFn: (status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED') => updateOrderStatus(orderId, status),
        onSuccess: async () => {
            setShowStatusConfirm(false)
            setStatusDropdownOpen(false)
            await queryClient.invalidateQueries({ queryKey: ['order', 'detail', orderId] })
            await queryClient.refetchQueries({ queryKey: ['order', 'detail', orderId], exact: true, type: 'active' })
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>
            console.error('Update Status Error:', {
                status: axiosError?.response?.status,
                data: axiosError?.response?.data,
                message: axiosError?.message,
            })
        },
    })

    const cancelMutation = useMutation({
        mutationFn: () => cancelOrder(orderId),
        onSuccess: async () => {
            setShowCancelConfirm(false)
            await queryClient.invalidateQueries({ queryKey: ['order', 'detail', orderId] })
            await queryClient.refetchQueries({ queryKey: ['order', 'detail', orderId], exact: true, type: 'active' })
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>
            console.error('Cancel Order Error:', {
                status: axiosError?.response?.status,
                data: axiosError?.response?.data,
                message: axiosError?.message,
            })
        },
    })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setStatusDropdownOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setStatusDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    const handleStatusSelect = (status: StatusOption) => {
        setSelectedStatus(status)
        setStatusDropdownOpen(false)
        setShowStatusConfirm(true)
    }

    const handleConfirmStatusUpdate = () => {
        const backendStatus = statusToBackend[selectedStatus]
        statusMutation.mutate(backendStatus)
    }

    const handleConfirmCancel = () => {
        cancelMutation.mutate()
    }

    if (isCancelled) {
        return null
    }

    return (
        <>
            <div className="flex items-center gap-2 self-start w-full sm:w-auto justify-end">
                <div className="relative" ref={containerRef}>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setStatusDropdownOpen((value) => !value)}
                        disabled={statusMutation.isPending || cancelMutation.isPending}
                        className="bg-[#1A0089] hover:bg-[#14006b] text-white disabled:opacity-50"
                    >
                        Update Status
                    </Button>

                    {statusDropdownOpen && (
                        <div className="absolute left-0 sm:left-auto sm:right-0 top-full z-30 mt-2 w-44 max-w-[calc(100vw-2rem)] max-h-60 overflow-y-auto rounded-lg border bg-white p-1 shadow-lg">
                            {statusOptions.map((status) => {
                                const isSelected = selectedStatus === status

                                return (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => handleStatusSelect(status)}
                                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${isSelected ? 'bg-[#D6D2EC] text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`}
                                    >
                                        {isSelected ? <FaCheck className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5" />}
                                        <span>{status}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={statusMutation.isPending || cancelMutation.isPending}
                    variant="outline"
                    className="border border-red-600 text-red-600 bg-white hover:bg-red-700 hover:text-white disabled:opacity-50"
                >
                    Cancel Order
                </Button>
            </div>

            <ConfirmModal
                isOpen={showStatusConfirm}
                title="Update Order Status"
                description={`Are you sure you want to update this order status to "${selectedStatus}"?`}
                confirmLabel="Update Status"
                isLoading={statusMutation.isPending}
                onConfirm={handleConfirmStatusUpdate}
                onCancel={() => setShowStatusConfirm(false)}
            />

            <ConfirmModal
                isOpen={showCancelConfirm}
                title="Cancel Order"
                description={`Are you sure you want to cancel ${orderLabel}?`}
                confirmLabel="Cancel Order"
                isDangerous
                isLoading={cancelMutation.isPending}
                onConfirm={handleConfirmCancel}
                onCancel={() => setShowCancelConfirm(false)}
            />
        </>
    )
}
