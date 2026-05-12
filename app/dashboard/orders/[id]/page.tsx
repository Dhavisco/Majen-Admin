'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import OrderDetailActions from '@/app/dashboard/orders/[id]/OrderDetailActions'
import OrderItemCard from '@/app/dashboard/orders/[id]/OrderItemCard'
import { Badge } from '@/components/ui/badge'
import { getOrderById } from '@/lib/api/orders'

type OrderItem = {
    quantity: number
    price: string
    selectedRecommendedSize?: { sizeType?: string }
    selectedSize?: { sizeType?: string } | null
    selectedColour?: { name?: string; hash?: string }
    product: { title: string; photos: Array<{ url: string }> }
}

type OrderDetail = {
    id: number
    identifier: string
    price: string
    payments: Array<{ totalAmount: string }>
    createdAt: string
    shippingMethod: string
    updatedAt: string
    items: OrderItem[]
    client: { id: number; firstName: string; lastName: string }
    timelines: Array<{ status: string; createdAt: string }>
    status?: string
  }

const toneByStatus: Record<string, string> = {
    CONFIRMED: 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20 font-semibold',
    DELIVERED: 'bg-green-500/20 text-green-700 hover:bg-green-500/20 font-semibold',
    PENDING: 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/20 font-semibold',
    PROCESSING: 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/20 font-semibold',
    CANCELLED: 'bg-rose-500/20 text-rose-700 hover:bg-rose-500/20 font-semibold',
}

const statusLabelMap: Record<string, string> = {
    CONFIRMED: 'Confirmed',
    DELIVERED: 'Delivered',
    PENDING: 'Awaiting',
    PROCESSING: 'Processing',
    CANCELLED: 'Cancelled',
}

const formatCurrency = (value?: string | number) => {
    const parsed = typeof value === 'string' ? Number.parseFloat(value) : value ?? 0

    if (Number.isNaN(Number(parsed))) {
        return '₦0'
    }

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    })
        .format(Number(parsed))
        .replace('NGN', '₦')
}

const formatDate = (value: string) => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

function OrderSkeleton() {
    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0 animate-pulse">
                <section className="rounded-2xl border bg-white overflow-hidden">
                    <div className="px-4 py-4 border-b flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-3">
                            <div className="h-4 w-24 rounded bg-gray-200" />
                            <div className="h-8 w-56 rounded bg-gray-200" />
                            <div className="h-4 w-72 rounded bg-gray-200" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-9 w-24 rounded bg-gray-200" />
                            <div className="h-9 w-24 rounded bg-gray-200" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 p-4">
                        <div className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <div className="h-5 w-40 rounded bg-gray-200" />
                                    <div className="h-7 w-24 rounded bg-gray-200" />
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b">
                                    <div className="h-16 rounded bg-gray-200" />
                                    <div className="h-16 rounded bg-gray-200" />
                                    <div className="h-16 rounded bg-gray-200" />
                                    <div className="h-16 rounded bg-gray-200" />
                                    <div className="h-16 rounded bg-gray-200" />
                                    <div className="h-16 rounded bg-gray-200" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-96 rounded-xl bg-gray-200" />
                                <div className="h-96 rounded-xl bg-gray-200" />
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b h-11 bg-gray-200" />
                                <div className="p-4 space-y-4">
                                    <div className="h-5 w-full rounded bg-gray-200" />
                                    <div className="h-5 w-full rounded bg-gray-200" />
                                    <div className="h-5 w-full rounded bg-gray-200" />
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}

export default function OrderDetailsPage() {
    const params = useParams()
    // const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
    const rawId = params.id as string | undefined
    const id = Number.parseInt(rawId ?? '', 10)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['order', 'detail', id],
        queryFn: () => getOrderById(id),
        enabled: Number.isFinite(id),
    })

    const order = data as OrderDetail | undefined

    const visibleStatusKey = useMemo(() => {
        if (!order) return 'PENDING'
        return (order.status ?? order.timelines.at(-1)?.status ?? 'PENDING').toUpperCase()
    }, [order])

    if (!Number.isFinite(id) || isError) {
        notFound()
    }

    if (isLoading || !order) {
        return <OrderSkeleton />
    }

    const customerName = [order.client.firstName, order.client.lastName].filter(Boolean).join(' ').trim() || '—'
    const orderTotal = order.price ?? order.payments.at(-1)?.totalAmount ?? '0'

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-white overflow-hidden">
                    <div className="px-4 py-4 border-b flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order Details</p>
                            <h1 className="text-2xl font-bold mt-1">#{order.identifier}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Purchased by {customerName} | Ordered {formatDate(order.createdAt)}
                            </p>
                        </div>

                        <OrderDetailActions orderId={id} orderLabel={`Order #${order.identifier}`} currentStatus={statusLabelMap[visibleStatusKey] ?? visibleStatusKey} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 p-4">
                        <div className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b font-semibold flex items-center justify-between">
                                    <span>Order Information</span>
                                    <Badge className={toneByStatus[visibleStatusKey] ?? 'bg-white text-slate-700'}>
                                        {statusLabelMap[visibleStatusKey] ?? visibleStatusKey}
                                    </Badge>
                                </div>

                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b">
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Order ID</p>
                                        <p className="font-semibold mt-1">{order.identifier}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Order total</p>
                                        <p className="font-semibold mt-1">{formatCurrency(orderTotal)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Shipping method</p>
                                        <p className="font-semibold mt-1">{order.shippingMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Created at</p>
                                        <p className="font-semibold mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Updated at</p>
                                        <p className="font-semibold mt-1">{formatDate(order.updatedAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Items</p>
                                        <p className="font-semibold mt-1">{order.items.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <OrderItemCard
                                        key={`${item.product.title}-${index}`}
                                        item={item}
                                        index={index}
                                        total={order.items.length}
                                    />
                                ))}
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b font-semibold">Order tracking</div>
                                <div className="divide-y text-sm">
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Order status</span>
                                        <Badge className={toneByStatus[visibleStatusKey] ?? 'bg-white text-slate-700'}>
                                            {statusLabelMap[visibleStatusKey] ?? visibleStatusKey}
                                        </Badge>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Last updated</span>
                                        <span className="font-semibold">{formatDate(order.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <span className="font-semibold">Client</span>
                                    <Link href={`/dashboard/clients/${order.client.id}`} className="text-sm font-semibold text-[#1A0089] hover:underline">
                                        View Profile →
                                    </Link>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E3FF] text-[#1A0089] font-bold">
                                            {customerName
                                                .split(' ')
                                                .filter(Boolean)
                                                .map((value) => value[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                        <div>
                                            <p className="font-semibold">{customerName}</p>
                                            <p className="text-sm text-muted-foreground">Client #{order.client.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b font-semibold">Timeline</div>
                                <div className="divide-y text-sm">
                                    {order.timelines.map((timeline) => (
                                        <div key={`${timeline.status}-${timeline.createdAt}`} className="px-4 py-3 flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground">{statusLabelMap[timeline.status.toUpperCase()] ?? timeline.status}</span>
                                            <span className="font-semibold text-right">{formatDate(timeline.createdAt)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}