import { notFound } from 'next/navigation'
import Link from 'next/link'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import ModerationActionButton from '@/app/components/ModerationAction/ModerationActionButton'
import { Badge } from '@/components/ui/badge'
import { products } from '@/app/dashboard/products/data'
import { designers } from '@/app/dashboard/designers/data'

type PageProps = {
    params: Promise<{ id: string }>
}

const toneByStatus: Record<string, string> = {
    Active: 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20 font-semibold',
    Pending: 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/20 font-semibold',
    Rejected: 'bg-rose-500/20 text-rose-700 hover:bg-rose-500/20 font-semibold',
}

const listingStatusLabel: Record<string, string> = {
    Active: 'Active',
    Pending: 'Pending review',
    Rejected: 'Rejected',
}

const listingStatusClass: Record<string, string> = {
    Active: 'text-emerald-700 font-bold',
    Pending: 'text-amber-700 font-bold',
    Rejected: 'text-rose-700 font-bold',
}

export default async function ProductProfilePage({ params }: PageProps) {
    const { id } = await params
    const product = products.find((item) => String(item.id) === id)

    if (!product) {
        notFound()
    }

    const designer = designers.find((item) => item.name === product.designer)

    const visibility = product.status === 'Pending' ? 'Hidden' : 'Public'
    const processingTime = '10 days'
    const submittedOn = 'Mar 12, 2025'
    const lastUpdated = 'Mar 16, 2025'
    const productDescription =
        product.description ||
        'This space will have a description of the product. It will be the same description that the designer entered when creating the product.'

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-white overflow-hidden">
                    <div className="px-4 py-4 border-b flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{product.name}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Listed by {product.designer} | Submitted {product.createdAt}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start">
                            <ModerationActionButton
                                action="approve-product"
                                subject={product.name}
                                buttonLabel="Accept"
                                buttonSize="sm"
                                buttonClassName="bg-[#1A0089] hover:bg-[#14006b] cursor-pointer text-white"
                            />
                            <ModerationActionButton
                                action="reject-product"
                                subject={product.name}
                                buttonLabel="Reject"
                                buttonVariant="outline"
                                buttonSize="sm"
                                buttonClassName="border border-red-600 hover:bg-red-700 text-red-600 cursor-pointer bg-white hover:font-semibold hover:text-white"
                                requireReason
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 p-4">
                        <div className="rounded-xl border overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold flex items-center justify-between">
                                <span>Product Information</span>
                                <Badge className={toneByStatus[product.status] ?? 'bg-white text-slate-700'}>
                                    {listingStatusLabel[product.status] ?? product.status}
                                </Badge>
                            </div>

                            <div className="p-4 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 border-b">
                                <div className="space-y-2">
                                    <div className="h-44 rounded-lg bg-[#DAD3F0]" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-12 rounded-md bg-[#DAD3F0]" />
                                        <div className="h-12 rounded-md bg-[#DAD3F0]" />
                                        <div className="h-12 rounded-md bg-[#DAD3F0]" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">{product.name}</h2>
                                        <p className="text-2xl font-bold text-[#1A0089] mt-1">{product.price}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-y py-4">
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Category</p>
                                            <p className="font-semibold mt-1">{product.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Processing time</p>
                                            <p className="font-semibold mt-1">{processingTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Type</p>
                                            <p className="font-semibold mt-1">{designer?.type ?? 'Ready to wear'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Fabric</p>
                                            <p className="font-semibold mt-1">{product.material}</p>
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
                                            <p className="font-semibold mt-1">{product.sizes.join(', ')}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-muted-foreground">Quantity</p>
                                            <p className="font-semibold mt-1">{product.stock}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-xs uppercase text-muted-foreground">Product description</p>
                                <p className="mt-2 text-sm font-medium text-slate-700">{productDescription}</p>
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b font-semibold">Listing Moderation</div>
                                <div className="divide-y text-sm">
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Listing status</span>
                                        <span className={`font-semibold ${listingStatusClass[product.status] ?? 'text-slate-700'}`}>• {listingStatusLabel[product.status] ?? product.status}</span>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Visibility</span>
                                        <span className="font-semibold">{visibility}</span>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Submitted</span>
                                        <span className="font-semibold">{submittedOn}</span>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-muted-foreground">Last updated</span>
                                        <span className="font-semibold">{lastUpdated}</span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-2 border-t">
                                    <ModerationActionButton
                                        action="approve-product"
                                        subject={product.name}
                                        buttonClassName="w-full justify-center bg-[#1A0089] hover:bg-[#14006b] text-white"
                                    />
                                    <ModerationActionButton
                                        action="reject-product"
                                        subject={product.name}
                                        buttonClassName="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
                                        requireReason
                                    />
                                    <ModerationActionButton
                                        action="hide-product"
                                        subject={product.name}
                                        buttonClassName="w-full justify-center bg-amber-500 hover:bg-amber-600 text-white"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border overflow-hidden bg-white">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <span className="font-semibold">Designer</span>
                                    {designer ? (
                                        <Link href={`/dashboard/designers/${designer.id}`} className="text-sm font-semibold text-[#1A0089] hover:underline">
                                            View Profile →
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No profile</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E3FF] text-[#1A0089] font-bold">
                                            {product.designer
                                                .split(' ')
                                                .filter(Boolean)
                                                .map((item) => item[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                        <div>
                                            <p className="font-semibold uppercase">{product.designer}</p>
                                            <p className="text-xs text-muted-foreground">{designer?.business ?? 'Designer'} · {designer?.type ?? 'Ready to wear'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 text-center">
                                        Verified Designer
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
