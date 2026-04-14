'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
    FaBan,
    FaCheckCircle,
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
    warningText?: string
    reasonText?: string
    requireReason?: boolean
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
        iconBoxClassName: 'bg-red-50',
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
    buttonVariant,
    buttonSize = 'default',
    disabled,
    warningText,
    reasonText,
    requireReason,
}: ModerationActionButtonProps) {
    const [open, setOpen] = useState(false)

    const config = useMemo(() => actionConfigByType[action], [action])
    const TriggerIcon = triggerIconByAction[action]

    const finalWarning = warningText ?? config.warningText
    const needsReason = Boolean(requireReason && !reasonText)
    const confirmLabel = needsReason ? 'Select Reason' : config.confirmLabel

    useEffect(() => {
        if (!open) {
            return
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        window.addEventListener('keydown', handleEscape)

        return () => {
            window.removeEventListener('keydown', handleEscape)
        }
    }, [open])

    return (
        <>
            <Button
                type="button"
                variant={buttonVariant}
                size={buttonSize}
                disabled={disabled}
                className={buttonClassName}
                onClick={() => setOpen(true)}
            >
                <TriggerIcon className="mr-2" />
                {buttonLabel ?? config.confirmLabel}
            </Button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setOpen(false)}
                    role="presentation"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={config.title}
                        className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className={cn('inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl', config.iconBoxClassName)}>
                            <config.icon className={cn('h-5 w-5 sm:h-6 sm:w-6', config.iconClassName)} />
                        </div>

                        <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{config.title}</h3>
                        <p className="mt-2 inline-flex max-w-full rounded-lg border bg-gray-50 px-3 py-1 text-sm text-slate-800 wrap-break-word whitespace-normal">{subject}</p>

                        {finalWarning && (
                            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                ⚠ {finalWarning}
                            </div>
                        )}

                        <p className="mt-4 max-w-full whitespace-normal wrap-break-word text-sm sm:text-base leading-6 sm:leading-7 text-slate-600">{config.description}</p>
                        {reasonText && <p className="mt-3 text-sm sm:text-base text-slate-700 wrap-break-word">Reason: {reasonText}</p>}

                        <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-[#B7B1F3] text-[#1A0089] hover:bg-[#F1EFFF] text-sm sm:text-base"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                disabled={needsReason}
                                className={cn(confirmToneClass[config.tone], 'text-sm sm:text-base', needsReason && 'cursor-not-allowed bg-red-200 text-red-600 hover:bg-red-200')}
                                onClick={() => setOpen(false)}
                            >
                                {confirmLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
