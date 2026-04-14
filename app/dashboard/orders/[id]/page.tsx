import Link from 'next/link'
import { notFound } from 'next/navigation'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import OrderDetailActions from '@/app/dashboard/orders/[id]/OrderDetailActions'
import { Badge } from '@/components/ui/badge'
import { clients } from '@/app/dashboard/clients/data'
import { products } from '@/app/dashboard/products/data'
import { orders } from '@/app/dashboard/orders/data'

type PageProps = {
    params: Promise<{ id: string }>
}

const toneByStatus: Record<string, string> = {
    Delivered: 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20 font-semibold',
    Processing: 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/20 font-semibold',
    Awaiting: 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/20 font-semibold',
    Cancelled: 'bg-rose-500/20 text-rose-700 hover:bg-rose-500/20 font-semibold',
}

export default async function OrderDetailsPage({ params }: PageProps) {
    const { id } = await params
    const order = orders.find((item) => String(item.id) === id)

    if (!order) {
        notFound()
    }

    const client = clients.find((item) => item.name === order.client)
    const product = products.find((item) => item.name === order.product)

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-white overflow-hidden">
                    <div className="px-4 py-4 border-b flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{order.product}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Purchased by {order.client} | Ordered {order.purchasedOn}
                            </p>
                        </div>

                        <OrderDetailActions orderLabel={`${order.product} · #${order.orderId}`} currentStatus={order.status} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 p-4">
                        <div className="rounded-xl border overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold flex items-center justify-between">
                                <span>Order Information</span>
                                <Badge className={toneByStatus[order.status] ?? 'bg-white text-slate-700'}>• {order.status}</Badge>
                            </div>

                            <div className="p-4 grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-4">
                                <div className="h-44 rounded-lg bg-[#DAD3F0]" />

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <h2 className="text-3xl font-bold tracking-tight">{order.product}</h2>
                                        {product ? (
                                            <Link href={`/dashboard/products/${product.id}`} className="text-sm font-semibold text-[#1A0089] hover:underline">
                                                View Item →
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Item unavailable</span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-y py-4">
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Order date</p>
                                            <p className="font-semibold mt-1">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Size</p>
                                            <p className="font-semibold mt-1">{order.size}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Item price</p>
                                            <p className="font-semibold mt-1">{order.itemPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Color</p>
                                            <p className="font-semibold mt-1 inline-flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-red-500" /> {order.color}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Amount paid</p>
                                            <p className="font-semibold mt-1">{order.amountPaid}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Quantity</p>
                                            <p className="font-semibold mt-1">{order.quantity}</p>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <p className="text-xs uppercase text-muted-foreground">Shipping method</p>
                                            <p className="font-semibold mt-1">{order.shippingMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b font-semibold">Order tracking</div>
                                <div className="divide-y text-sm">
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Order status</span>
                                        <Badge className={toneByStatus[order.status] ?? 'bg-white text-slate-700'}>• {order.status}</Badge>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Last updated</span>
                                        <span className="font-semibold">{order.lastUpdated}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <span className="font-semibold">Client</span>
                                    {client ? (
                                        <Link href={`/dashboard/clients/${client.id}`} className="text-sm font-semibold text-[#1A0089] hover:underline">
                                            View Profile →
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No profile</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E3FF] text-[#1A0089] font-bold">
                                            {order.client
                                                .split(' ')
                                                .filter(Boolean)
                                                .map((item) => item[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                        <div>
                                            <p className="font-semibold">{order.client}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}
