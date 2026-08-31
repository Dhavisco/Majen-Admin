'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
    FaBan,
    FaCheckCircle,
    FaEye,
    FaEyeSlash,
    FaFlag,
    FaLockOpen,
    FaPauseCircle,
    FaTimes,
    FaTrash,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ModerationActionType =
    | 'verify-account'
    | 'reject-application'
    | 'flag-account'
    | 'suspend-account'
    | 'ban-account'
    | 'reactivate-account'
    | 'approve-product'
    | 'reject-product'
    | 'hide-product'
    | 'show-product'
    | 'cancel-order'
    | 'remove-review'

type ConfirmTone = 'primary' | 'danger' | 'warning' | 'success'

type ActionConfig = {
    title: string
    description: string
    confirmLabel: string
    tone: ConfirmTone
    icon: IconType
    iconBoxClassName: string
    iconClassName: string
    warningText?: string
}

type ModerationActionButtonProps = {
    action: ModerationActionType
    subject: string
    buttonLabel?: string
    buttonClassName?: string
    buttonVariant?: React.ComponentProps<typeof Button>['variant']
    buttonSize?: React.ComponentProps<typeof Button>['size']
    disabled?: boolean
    onConfirm?: (reason?: string) => Promise<void> | void
    warningText?: string
    reasonText?: string
    requireReason?: boolean
    activeOrderCount?: number
}

const actionConfigByType: Record<ModerationActionType, ActionConfig> = {
    'verify-account': {
        title: 'Verify account',
        description: 'Grants full access to sell on Majen. Their profile and products become visible to clients.',
        confirmLabel: 'Verify',
        tone: 'success',
        icon: FaCheckCircle,
        iconBoxClassName: 'bg-emerald-50',
        iconClassName: 'text-emerald-600',
    },
    'reject-application': {
        title: 'Reject application',
        description: 'The application is rejected and the applicant notified by email. They may reapply after 30 days.',
        confirmLabel: 'Reject',
        tone: 'danger',
        icon: FaTimes,
        iconBoxClassName: 'bg-red-50',
        iconClassName: 'text-red-600',
    },
    'flag-account': {
        title: 'Flag account',
        description: 'Adds an internal warning visible to all admins. The seller is not notified.',
        confirmLabel: 'Flag',
        tone: 'warning',
        icon: FaFlag,
        iconBoxClassName: 'bg-amber-50',
        iconClassName: 'text-amber-700',
    },
    'suspend-account': {
        title: 'Suspend account',
        description: 'Temporarily suspends the account and hides all listings. Can be reversed at any time.',
        confirmLabel: 'Suspend',
        tone: 'warning',
        icon: FaPauseCircle,
        iconBoxClassName: 'bg-amber-50',
        iconClassName: 'text-amber-700',
        warningText: 'This account has active orders. Clients will be notified and orders may be affected.',
    },
    'ban-account': {
        title: 'Ban account',
        description: 'Permanently blocks all platform access and hides all listings. Use only for serious violations.',
        confirmLabel: 'Ban account',
        tone: 'danger',
        icon: FaBan,
        iconBoxClassName: 'bg-red-50',
        iconClassName: 'text-red-600',
        warningText: 'This account has active orders. Clients will be notified and orders may be affected.',
    },
    'reactivate-account': {
        title: 'Reactivate account',
        description: 'Restores full platform access and makes all approved listings visible to clients again.',
        confirmLabel: 'Reactivate',
        tone: 'success',
        icon: FaLockOpen,
        iconBoxClassName: 'bg-emerald-50',
        iconClassName: 'text-emerald-600',
    },
    'approve-product': {
        title: 'Approve product',
        description: 'The product will be listed publicly and become visible to clients immediately.',
        confirmLabel: 'Approve Product',
        tone: 'primary',
        icon: FaCheckCircle,
        iconBoxClassName: 'bg-indigo-50',
        iconClassName: 'text-[#1A0089]',
    },
    'reject-product': {
        title: 'Reject product',
        description: 'The product is hidden and the designer notified. They may resubmit after revisions.',
        confirmLabel: 'Reject Product',
        tone: 'danger',
        icon: FaTimes,
        iconBoxClassName: 'bg-[#FECACA]',
        iconClassName: 'text-red-600',
    },
    'hide-product': {
        title: 'Hide product',
        description: 'Temporarily hides this product from clients while keeping the listing data intact.',
        confirmLabel: 'Hide Product',
        tone: 'warning',
        icon: FaEyeSlash,
        iconBoxClassName: 'bg-amber-50',
        iconClassName: 'text-amber-700',
    },
    'show-product': {
        title: 'Show product',
        description: 'Makes this product visible to clients again while preserving listing history.',
        confirmLabel: 'Show Product',
        tone: 'success',
        icon: FaEye,
        iconBoxClassName: 'bg-emerald-50',
        iconClassName: 'text-emerald-700',
    },
    'cancel-order': {
        title: 'Cancel order',
        description: 'Cancels this order and notifies the client. Any refund process will begin immediately based on payment rules.',
        confirmLabel: 'Cancel Order',
        tone: 'danger',
        icon: FaTimes,
        iconBoxClassName: 'bg-red-50',
        iconClassName: 'text-red-600',
    },
    'remove-review': {
        title: 'Remove review',
        description: 'Permanently removes this review. This cannot be undone.',
        confirmLabel: 'Remove review',
        tone: 'danger',
        icon: FaTrash,
        iconBoxClassName: 'bg-red-50',
        iconClassName: 'text-red-600',
    },
}

const triggerIconByAction: Record<ModerationActionType, IconType> = {
    'verify-account': FaCheckCircle,
    'reject-application': FaTimes,
    'flag-account': FaFlag,
    'suspend-account': FaPauseCircle,
    'ban-account': FaBan,
    'reactivate-account': FaLockOpen,
    'approve-product': FaCheckCircle,
    'reject-product': FaTimes,
    'hide-product': FaEyeSlash,
    'show-product': FaEye,
    'cancel-order': FaTimes,
    'remove-review': FaTrash,
}

const confirmToneClass: Record<ConfirmTone, string> = {
    primary: 'bg-[#1A0089] hover:bg-[#14006b] text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
}

export default function ModerationActionButton({
    action,
    subject,
    buttonLabel,
    buttonClassName,
    activeOrderCount,
    buttonVariant,
    buttonSize = 'default',
    disabled,
    onConfirm,
    warningText,
    reasonText,
    requireReason,
}: ModerationActionButtonProps) {
    const [open, setOpen] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')


    const config = useMemo(() => actionConfigByType[action], [action])
    const TriggerIcon = triggerIconByAction[action]

    const finalWarning = useMemo(() => {
        // Only show warning for suspend or ban
        if (action !== 'suspend-account' && action !== 'ban-account') {
            return undefined
        }

        // No active orders → no warning
        if (activeOrderCount === 0 || activeOrderCount === undefined) {
            return undefined
        }

        // Active orders present → dynamic warning
        if (typeof activeOrderCount === 'number' && activeOrderCount > 0) {
            return `This account has ${activeOrderCount} active order${activeOrderCount > 1 ? 's' : ''}. Clients will be notified and orders may be affected.`
        }

        // Fallback to static warning text if provided
        return warningText ?? config.warningText
    }, [action, activeOrderCount, warningText, config.warningText])

    const showReasonInput = action === 'reject-application' || requireReason
    const needsReason = showReasonInput && rejectionReason.trim().length === 0
    const finalConfirmLabel = action === 'reject-product' ? 'Select Reasons' : config.confirmLabel
    const confirmLabel = needsReason ? 'Enter reason' : finalConfirmLabel

    const handleConfirm = async () => {
        if (isSubmitting) return

        // Always show warning first
        setShowWarning(true)
    }

    // Final confirmation after warning
    const handleFinalConfirm = async () => {
        if (!onConfirm) {
            setOpen(false)
            setShowWarning(false)
            return
        }

        try {
            setIsSubmitting(true)
            await onConfirm(showReasonInput ? rejectionReason.trim() : undefined)
            setOpen(false)
            setShowWarning(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (!open) {
            setRejectionReason(reasonText ?? '')
            return
        }

        setRejectionReason(reasonText ?? '')

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                setOpen(false)
            }
        }

        window.addEventListener('keydown', handleEscape)

        return () => {
            window.removeEventListener('keydown', handleEscape)
        }
    }, [open, reasonText, isSubmitting])


    return (
        <>
            <Button
                type="button"
                variant={buttonVariant}
                size={buttonSize}
                disabled={disabled}
                className={cn('cursor-pointer', buttonClassName)}
                onClick={() => setOpen(true)}
            >
                <TriggerIcon className="mr-2" />
                {buttonLabel ?? config.confirmLabel}
            </Button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4"
                    onClick={() => setOpen(false)}
                    role="presentation"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`moderation-title-${action}`}
                        aria-describedby={`moderation-description-${action}`}
                        className="w-full max-w-lg  rounded-3xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="" />

                        <div className="relative px-4 py-5 sm:px-6 sm:py-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close dialog"
                                className="absolute right-3 top-3 cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                                <FaTimes className="h-4 w-4" />
                            </button>

                            <div className="flex">
                                <div className={cn('inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm', config.iconBoxClassName)}>
                                    <config.icon className={cn('h-6 w-6', config.iconClassName)} />
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <h3 id={`moderation-title-${action}`} className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                    {config.title}
                                </h3>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    {/* <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Subject</p> */}
                                    <p className="mt-1 max-w-full wrap-break-word text-sm font-medium text-slate-900 sm:text-base whitespace-normal leading-6">{subject}</p>
                                </div>
                                {finalWarning && (
                                    <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                                        <div className="flex items-start gap-2">
                                            <span className="mt-0.5 text-amber-700">⚠</span>
                                            <p className="wrap-break-word whitespace-normal leading-6">{finalWarning}</p>
                                        </div>
                                    </div>
                                )}

                                <p id={`moderation-description-${action}`} className="mx-auto max-w-full text-sm text-slate-600 sm:text-base wrap-break-word whitespace-normal leading-6">
                                    {config.description}
                                </p>
                            </div>





                            {showReasonInput && (
                                <div className="mt-5 rounded-2xl bg-white p-4 shadow-xs">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <label htmlFor={`moderation-reason-${action}`} className="text-sm font-semibold text-slate-900">
                                                {action === 'flag-account' && 'Flag reason'}
                                                {action === 'reject-application' && 'Rejection reason'}
                                                {action === 'suspend-account' && 'Suspension reason'}
                                            </label>
                                            {/* <p className="mt-1 text-xs text-slate-500">
                                                Tell the admin team why this request is being rejected. Keep it clear and specific.
                                            </p> */}
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                            Required
                                        </span>
                                    </div>

                                    <textarea
                                        id={`moderation-reason-${action}`}
                                        value={rejectionReason}
                                        onChange={(event) => setRejectionReason(event.target.value)}
                                        rows={5}
                                        placeholder="Example: Rc number does not match business name."
                                        className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#1A0089] focus:bg-white focus:ring-4 focus:ring-[#1A0089]/10"
                                    />

                                    <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                                        <span>{needsReason ? 'Please enter a reason before continuing.' : 'This note will be saved with the rejection action.'}</span>
                                        <span>{rejectionReason.trim().length} characters</span>
                                    </div>
                                </div>
                            )}

                            {reasonText && !showReasonInput && (
                                <p className="mt-3 text-sm text-slate-700 wrap-break-word">Reason: {reasonText}</p>
                            )}

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 border-[#C4BCEF] border-2 text-[#1A0089] hover:bg-[#F1EFFF] text-sm font-semibold cursor-pointer"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={needsReason || isSubmitting}
                                    className={cn(
                                        confirmToneClass[config.tone],
                                        'h-11 text-sm font-semibold cursor-pointer',
                                        (needsReason || isSubmitting) && 'cursor-not-allowed bg-slate-200 text-slate-500 hover:bg-slate-200'
                                    )}
                                    onClick={handleConfirm}
                                >
                                    {isSubmitting ? 'Processing...' : confirmLabel}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showWarning && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/55 p-3 sm:p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
                        <h3 className="text-lg font-bold text-slate-900">⚠ Confirm Action</h3>
                        <p className="mt-2 text-sm text-slate-700">
                            Are you sure you want to {config.title}?
                        </p>
                        <div className="mt-4 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowWarning(false)}
                                disabled={isSubmitting} // disable cancel while submitting
                                className={isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-2 cursor-pointer"
                                onClick={handleFinalConfirm}
                                disabled={needsReason || isSubmitting}
                            >
                                {isSubmitting && (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                )}
                                {isSubmitting ? "Processing..." : `Yes, ${config.confirmLabel}`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}


        </>
    )
}