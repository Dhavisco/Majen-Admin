'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import ModerationActionButton from '@/app/components/ModerationAction/ModerationActionButton'
import { Badge } from '@/components/ui/badge'
import {
    acceptProduct,
    getProductById,
    getRejectionReasons,
    rejectProduct,
    updateProductVisibility,
    type ProductDetail,
    type RejectionReason,
} from '@/lib/api/products'
import { designers } from '@/app/dashboard/designers/data'

const toneByStatus: Record<string, string> = {
    Active: 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20 font-semibold',
    'Pending review': 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/20 font-semibold',
    Rejected: 'bg-rose-500/20 text-rose-700 hover:bg-rose-500/20 font-semibold',
}

const listingStatusLabel: Record<string, string> = {
    Active: 'Active',
    'Pending review': 'Pending review',
    Rejected: 'Rejected',
}

const listingStatusClass: Record<string, string> = {
    Active: 'text-emerald-700 font-bold',
    'Pending review': 'text-amber-700 font-bold',
    Rejected: 'text-rose-700 font-bold',
}

const visibilityLabel: Record<string, string> = {
    VISIBLE: 'Public',
    HIDDEN: 'Hidden',
}

const visibilityBadgeClass: Record<string, string> = {
    VISIBLE: ' text-emerald-700  font-semibold',
    HIDDEN: ' text-slate-700 font-semibold',
}

type ProductViewModel = {
    title: string
    description: string
    price: string
    quantity: number
    status: 'ACTIVE' | 'PENDING' | 'REJECTED'
    visibility: 'VISIBLE' | 'HIDDEN'
    createdAt: string
    updatedAt: string
    fabricUsed: string
    categoryName: string
    businessName: string
    designerName: string
    designerImage: string | null
    verificationStatus: string
    sizeSource: string
    sizes: string[]
    recommendedSizes: string[]
    photos: string[]
}

const formatPrice = (price: string | number): string => {
    const num = typeof price === 'string' ? Number.parseFloat(price) : price

    if (Number.isNaN(num)) {
        return '₦0'
    }

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(num).replace('NGN', '₦')
}

const formatDateTime = (value: string): string => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

const formatDate = (value: string): string => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
    }).format(date)
}

const getInitials = (value: string): string =>
    value
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

const mapProductToViewModel = (product: ProductDetail): ProductViewModel => {
    const designerFirstName = product.business.user.firstName
    const designerLastName = product.business.user.lastName
    const designerName = `${designerFirstName} ${designerLastName}`.trim()

    return {
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        status: product.status,
        visibility: product.visibility ?? product.visibilty ?? 'VISIBLE',
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        fabricUsed: product.fabricUsed,
        categoryName: product.category.name,
        businessName: product.business.businessName,
        designerName,
        designerImage: product.business.user.image,
        verificationStatus: product.business.verification.status,
        sizeSource: product.sizeSource,
        sizes: product.sizes.map((item) => item.sizeType),
        recommendedSizes: product.recommendedSizes.map((item) => item.sizeType),
        photos: product.photos.map((item) => item.url),
    }
}

function ProductSkeleton() {
    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-white overflow-hidden animate-pulse">
                    <div className="px-4 py-4 border-b flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-3">
                            <div className="h-8 w-52 rounded bg-gray-200" />
                            <div className="h-4 w-72 rounded bg-gray-200" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-9 w-24 rounded bg-gray-200" />
                            <div className="h-9 w-24 rounded bg-gray-200" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 p-4">
                        <div className="rounded-xl border overflow-hidden">
                            <div className="px-4 py-3 border-b flex items-center justify-between">
                                <div className="h-5 w-40 rounded bg-gray-200" />
                                <div className="h-7 w-24 rounded-full bg-gray-200" />
                            </div>

                            <div className="p-4 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 border-b">
                                <div className="space-y-2">
                                    <div className="h-44 rounded-lg bg-gray-200" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-12 rounded-md bg-gray-200" />
                                        <div className="h-12 rounded-md bg-gray-200" />
                                        <div className="h-12 rounded-md bg-gray-200" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="h-8 w-48 rounded bg-gray-200" />
                                        <div className="h-8 w-32 rounded bg-gray-200" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-y py-4">
                                        <div className="space-y-2">
                                            <div className="h-3 w-20 rounded bg-gray-200" />
                                            <div className="h-5 w-28 rounded bg-gray-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-24 rounded bg-gray-200" />
                                            <div className="h-5 w-28 rounded bg-gray-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-16 rounded bg-gray-200" />
                                            <div className="h-5 w-24 rounded bg-gray-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-16 rounded bg-gray-200" />
                                            <div className="h-5 w-28 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-32 rounded bg-gray-200" />
                                        <div className="h-4 w-full rounded bg-gray-200" />
                                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="h-4 w-40 rounded bg-gray-200" />
                                <div className="h-4 w-full rounded bg-gray-200" />
                                <div className="h-4 w-11/12 rounded bg-gray-200" />
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b h-11 bg-gray-200" />
                                <div className="p-4 space-y-4">
                                    <div className="h-5 w-full rounded bg-gray-200" />
                                    <div className="h-5 w-full rounded bg-gray-200" />
                                    <div className="h-5 w-full rounded bg-gray-200" />
                                    <div className="h-5 w-full rounded bg-gray-200" />
                                </div>
                            </div>

                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b h-11 bg-gray-200" />
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-40 rounded bg-gray-200" />
                                            <div className="h-3 w-32 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-8 rounded-full bg-gray-200" />
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}

export default function ProductProfilePage() {
    const params = useParams()
    const rawId = params.id as string | undefined
    const id = Number.parseInt(rawId ?? '', 10)
    const queryClient = useQueryClient()
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [selectedRejectionReason, setSelectedRejectionReason] = useState<RejectionReason | null>(null)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['product', 'detail', id],
        queryFn: () => getProductById(id),
        enabled: Number.isFinite(id),
    })

    const { data: rejectionReasonsData } = useQuery({
        queryKey: ['rejection-reasons'],
        queryFn: () => getRejectionReasons(),
    })

    const acceptMutation = useMutation({
        mutationFn: () => acceptProduct(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['product', 'detail', id] })
            await queryClient.refetchQueries({ queryKey: ['product', 'detail', id], exact: true, type: 'active' })
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>
            console.error('Accept Product Error:', {
                status: axiosError?.response?.status,
                data: axiosError?.response?.data,
                message: axiosError?.message,
            })
        },
    })

    const rejectMutation = useMutation({
        mutationFn: (rejectionReasonId: number) => rejectProduct(id, rejectionReasonId),
        onSuccess: async () => {
            setShowRejectModal(false)
            setSelectedRejectionReason(null)
            await queryClient.invalidateQueries({ queryKey: ['product', 'detail', id] })
            await queryClient.refetchQueries({ queryKey: ['product', 'detail', id], exact: true, type: 'active' })
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>
            console.error('Reject Product Error:', {
                status: axiosError?.response?.status,
                data: axiosError?.response?.data,
                message: axiosError?.message,
            })
        },
    })

    const visibilityMutation = useMutation({
        mutationFn: (status: 'VISIBLE' | 'HIDDEN') => updateProductVisibility(id, status),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['product', 'detail', id] })
            await queryClient.refetchQueries({ queryKey: ['product', 'detail', id], exact: true, type: 'active' })
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>
            console.error('Update Visibility Error:', {
                status: axiosError?.response?.status,
                data: axiosError?.response?.data,
                message: axiosError?.message,
            })
        },
    })

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => setSelectedPhotoIndex(0))
        return () => window.cancelAnimationFrame(frame)
    }, [id])

    if (!Number.isFinite(id) || isError) {
        notFound()
    }

    if (isLoading || !data) {
        return <ProductSkeleton />
    }

    const product = mapProductToViewModel(data.product)
    const statusLabel = listingStatusLabel[product.status === 'ACTIVE' ? 'Active' : product.status === 'PENDING' ? 'Pending review' : 'Rejected']
    const isPendingProduct = product.status === 'PENDING'
    const isActiveProduct = product.status === 'ACTIVE'
    const visibility = product.visibility
    const photos = product.photos
    const selectedPhoto = photos[selectedPhotoIndex] ?? photos[0] ?? ''
    const availableSizes = product.sizes.length > 0 ? product.sizes : product.recommendedSizes
    const designerProfile = designers.find(
        (item) => item.business === product.businessName || item.name === product.designerName || item.registeredName === product.businessName
    )
    const isVerified = product.verificationStatus.toUpperCase() === 'VERIFIED'

    const handleAccept = async () => {
        await acceptMutation.mutateAsync()
    }

    const handleReject = () => {
        setShowRejectModal(true)
        setSelectedRejectionReason(null)
    }

    const handleConfirmReject = async () => {
        if (!selectedRejectionReason) return
        await rejectMutation.mutateAsync(selectedRejectionReason.id)
    }

    const handleToggleVisibility = async () => {
        await visibilityMutation.mutateAsync(visibility === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE')
    }

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-white overflow-hidden">
                    <div className="px-4 py-4 border-b flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{product.title}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Listed by {product.businessName} | Submitted {formatDateTime(product.createdAt)}
                            </p>
                        </div>

                        {isPendingProduct ? (
                            <div className="flex items-center gap-2 self-start">
                                <ModerationActionButton
                                    action="approve-product"
                                    subject={product.title}
                                    buttonLabel="Accept"
                                    buttonSize="sm"
                                    buttonClassName="bg-[#1A0089] hover:bg-[#14006b] cursor-pointer text-white"
                                    onConfirm={handleAccept}
                                    disabled={acceptMutation.isPending}
                                />
                                <ModerationActionButton
                                    action="reject-product"
                                    subject={product.title}
                                    buttonLabel="Reject"
                                    buttonSize="sm"
                                    buttonVariant="outline"
                                    buttonClassName="border border-red-600 hover:bg-red-700 text-red-600 cursor-pointer bg-white hover:font-semibold hover:text-white"
                                    onConfirm={handleReject}
                                    disabled={rejectMutation.isPending}
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 p-4">
                        <div className="rounded-xl border overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold flex items-center justify-between">
                                <span>Product Information</span>
                                <Badge className={toneByStatus[statusLabel] ?? 'bg-white text-slate-700'}>
                                    {statusLabel}
                                </Badge>
                            </div>

                            <div className="p-4 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 border-b">
                                <div className="space-y-2">
                                    {selectedPhoto ? (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPhotoIndex(0)}
                                            className="block h-44 w-full overflow-hidden rounded-lg bg-[#DAD3F0]"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={selectedPhoto}
                                                alt={product.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ) : (
                                        <div className="h-44 rounded-lg bg-[#DAD3F0]" />
                                    )}

                                    <div className="grid grid-cols-3 gap-2">
                                        {photos.length > 0 ? photos.map((photo, index) => (
                                            <button
                                                key={photo}
                                                type="button"
                                                onClick={() => setSelectedPhotoIndex(index)}
                                                className={`overflow-hidden rounded-md border transition-all ${selectedPhotoIndex === index ? 'border-[#1A0089] ring-2 ring-[#1A0089]/20' : 'border-transparent'}`}
                                                aria-label={`View product image ${index + 1}`}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={photo}
                                                    alt={`${product.title} preview ${index + 1}`}
                                                    className="h-12 w-full object-cover"
                                                />
                                            </button>
                                        )) : (
                                            <>
                                                <div className="h-12 rounded-md bg-[#DAD3F0]" />
                                                <div className="h-12 rounded-md bg-[#DAD3F0]" />
                                                <div className="h-12 rounded-md bg-[#DAD3F0]" />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">{product.title}</h2>
                                        <p className="text-2xl font-bold text-[#1A0089] mt-1">{formatPrice(product.price)}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-y py-4">
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Category</p>
                                            <p className="font-semibold mt-1">{product.categoryName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Processing time</p>
                                            <p className="font-semibold mt-1">10 days</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Type</p>
                                            <p className="font-semibold mt-1">{product.sizeSource === 'RECOMMENDED' ? 'Ready to wear' : 'Custom'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Fabric</p>
                                            <p className="font-semibold mt-1">{product.fabricUsed}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Available colors</p>
                                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" /> Green</span>
                                                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /> Red</span>
                                                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-indigo-500" /> Blue</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Available sizes</p>
                                            <p className="font-semibold mt-1">{availableSizes.length > 0 ? availableSizes.join(', ') : 'No size data'}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Quantity</p>
                                            <p className="font-semibold mt-1">{product.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-xs uppercase text-muted-foreground">Product description</p>
                                <p className="mt-2 text-sm font-medium text-slate-700">{product.description}</p>
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b font-semibold">Listing Moderation</div>
                                <div className="divide-y text-sm">
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Listing status</span>
                                        <span className={`font-semibold ${listingStatusClass[statusLabel] ?? 'text-slate-700'}`}>• {statusLabel}</span>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Visibility</span>
                                        <span className={`font-semibold ${visibilityBadgeClass[visibility] ?? 'text-slate-700'}`}>{visibilityLabel[visibility] ?? visibility}</span>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Submitted</span>
                                        <span className="font-semibold">{formatDate(product.createdAt)}</span>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Last updated</span>
                                        <span className="font-semibold">{formatDate(product.updatedAt)}</span>
                                    </div>
                                </div>

                                {isPendingProduct || isActiveProduct ? (
                                    <div className="p-4 space-y-2 border-t">
                                        {isPendingProduct ? (
                                            <>
                                                <ModerationActionButton
                                                    action="approve-product"
                                                    subject={product.title}
                                                    buttonClassName="w-full justify-center bg-[#1A0089] hover:bg-[#14006b] text-white"
                                                    onConfirm={handleAccept}
                                                    disabled={acceptMutation.isPending}
                                                />
                                                <ModerationActionButton
                                                    action="reject-product"
                                                    subject={product.title}
                                                    buttonClassName="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
                                                    onConfirm={handleReject}
                                                    disabled={rejectMutation.isPending}
                                                />
                                            </>
                                        ) : null}

                                        {isActiveProduct ? (
                                            <ModerationActionButton
                                                action={visibility === 'VISIBLE' ? 'hide-product' : 'show-product'}
                                                subject={product.title}
                                                buttonClassName={visibility === 'VISIBLE'
                                                    ? 'w-full justify-center bg-amber-500 hover:bg-amber-600 text-white'
                                                    : 'w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white'}
                                                buttonLabel={visibility === 'VISIBLE' ? 'Hide Product' : 'Show Product'}
                                                onConfirm={handleToggleVisibility}
                                                disabled={visibilityMutation.isPending}
                                            />
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>

                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <span className="font-semibold">Designer</span>
                                    {designerProfile ? (
                                        <Link href={`/dashboard/designers/${designerProfile.id}`} className="text-sm font-semibold text-[#1A0089] hover:underline">
                                            View Profile →
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No profile</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E3FF] text-[#1A0089] font-bold overflow-hidden">
                                            {product.designerImage ? (
                                                <>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={product.designerImage} alt={product.designerName} className="h-full w-full object-cover" />
                                                </>
                                            ) : (
                                                getInitials(product.designerName || product.businessName)
                                            )}
                                        </span>
                                        <div>
                                            <p className="font-semibold uppercase">{product.designerName || product.businessName}</p>
                                            <p className="text-xs text-muted-foreground">{product.businessName} · {product.verificationStatus}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 text-center">
                                        {isVerified ? 'Verified Designer' : 'Pending Verification'}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Rejection Reason Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                            {/* Header */}
                            <button
                                onClick={() => {
                                    setShowRejectModal(false)
                                    setSelectedRejectionReason(null)
                                }}
                                disabled={rejectMutation.isPending}
                                className="flex items-start gap-4 mb-4">
                                <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-50">
                                    <span className="text-2xl">✕</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-red-600">Reject product</h2>
                                    <p className="text-sm text-black font-medium mt-1 rounded-lg bg-[#F4F4F5] border border-gray-300 py-1 px-3">
                                        {product.title}
                                    </p>
                                </div>
                            </button>

                            {/* Reasons List */}
                            <div className="space-y-2 my-6 max-h-64 overflow-y-auto">
                                {rejectionReasonsData?.reasons?.length ? (
                                    rejectionReasonsData.reasons.map((reason) => (
                                        <button
                                            key={reason.id}
                                            type="button"
                                            onClick={() => setSelectedRejectionReason(reason)}
                                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${selectedRejectionReason?.id === reason.id
                                                ? 'border-[#1A0089] bg-[#1A0089]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedRejectionReason?.id === reason.id
                                                        ? 'border-[#1A0089] bg-[#1A0089]'
                                                        : 'border-gray-300'
                                                        }`}
                                                >
                                                    {selectedRejectionReason?.id === reason.id && (
                                                        <span className="text-white text-xs">✓</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 capitalize">{reason.label}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{reason.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Loading rejection reasons...</p>
                                    </div>
                                )}
                            </div>

                            {/* Selected Reason Info */}
                            {selectedRejectionReason && (
                                <div className="mb-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-sm text-amber-900">
                                        <strong>Reason:</strong> {selectedRejectionReason.label}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectModal(false)
                                        setSelectedRejectionReason(null)
                                    }}
                                    disabled={rejectMutation.isPending}
                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-[#C4BCEF] cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmReject}
                                    disabled={!selectedRejectionReason || rejectMutation.isPending}
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {rejectMutation.isPending ? 'Rejecting...' : 'Reject Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
