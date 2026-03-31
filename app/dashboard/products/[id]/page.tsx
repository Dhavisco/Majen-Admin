import { notFound } from 'next/navigation'
import { FaCheckCircle, FaMinusCircle, FaTimesCircle } from 'react-icons/fa'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { products } from '@/app/dashboard/products/data'

type PageProps = {
    params: Promise<{ id: string }>
}

const toneByStatus: Record<string, string> = {
    Active: 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20',
    Pending: 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/20',
    Rejected: 'bg-rose-500/20 text-rose-200 hover:bg-rose-500/20',
}

export default async function ProductProfilePage({ params }: PageProps) {
    const { id } = await params
    const product = products.find((item) => String(item.id) === id)

    if (!product) {
        notFound()
    }

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-[#1A0089] p-4 md:p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold uppercase">{product.name}</h1>
                            <p className="text-white/80 text-sm mt-1">
                                by {product.designer} - {product.category}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <Badge className={toneByStatus[product.status]}>{product.status}</Badge>
                                {product.flags.length > 0 && (
                                    <Badge className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/20">
                                        {product.flags.length} flagged
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:w-auto">
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{product.price}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Price</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{product.stock}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Stock</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{product.views}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Views</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{product.sold}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Sold</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <section className="xl:col-span-2 space-y-4">
                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Product information</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">SKU</p>
                                    <p className="font-semibold mt-1">{product.sku}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Listed on</p>
                                    <p className="font-semibold mt-1">{product.createdAt}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Material</p>
                                    <p className="font-semibold mt-1">{product.material}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Color</p>
                                    <p className="font-semibold mt-1">{product.color}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Sizes</p>
                                    <p className="font-semibold mt-1">{product.sizes.join(', ')}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
                                    <p className="font-semibold mt-1">{product.category}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                                    <p className="font-medium mt-1 text-sm">{product.description}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-4">
                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Flags ({product.flags.length})</div>
                            <div className="p-4 space-y-2">
                                {product.flags.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No active flags.</p>
                                )}
                                {product.flags.map((flag, index) => (
                                    <div key={index} className="grid grid-cols-[70px_1fr] items-center gap-2 text-sm rounded-lg bg-gray-50 px-3 py-2">
                                        <span className="text-muted-foreground">{flag.date}</span>
                                        <span>{flag.reason}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-red-200 bg-red-50/30 overflow-hidden">
                            <div className="px-4 py-3 border-b border-red-200">
                                <p className="font-semibold text-red-700">Moderation actions</p>
                                <p className="text-xs text-red-600 mt-1">Changes take effect immediately</p>
                            </div>
                            <div className="p-4 space-y-2">
                                <Button className="w-full justify-start bg-[#1A0089] hover:bg-[#14006b] text-white">
                                    <FaCheckCircle className="mr-2" /> Approve listing
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50">
                                    <FaMinusCircle className="mr-2" /> Request changes
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50">
                                    <FaTimesCircle className="mr-2" /> Reject listing
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    )
}
