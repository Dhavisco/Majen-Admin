'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'

type OrderItem = {
    quantity: number
    price: string
    selectedRecommendedSize?: { sizeType?: string }
    selectedSize?: { sizeType?: string } | null
    selectedColour?: { name?: string; hash?: string }
    product: { title: string; photos: Array<{ url: string }> }
}

type OrderItemCardProps = {
    item: OrderItem
    index: number
    total: number
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

export default function OrderItemCard({ item, index, total }: OrderItemCardProps) {
    const photos = item.product.photos ?? []
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
    const selectedPhoto = photos[selectedPhotoIndex] ?? photos[0] ?? null
    const selectedSize = item.selectedSize?.sizeType ?? item.selectedRecommendedSize?.sizeType ?? '—'
    const colourHash = item.selectedColour?.hash ?? '#E5E7EB'
    const colourName = item.selectedColour?.name ?? '—'

    return (
        <section className="rounded-xl border overflow-hidden bg-white">
            <div className="px-4 py-3 border-b flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold">Item {index + 1}</p>
                    <p className="text-xs text-muted-foreground">Item {index + 1} of {total}</p>
                </div>

                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                    Qty {item.quantity}
                </Badge>
            </div>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
                <div className="space-y-3">
                    <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden border">
                        {selectedPhoto ? (
                            <img
                                src={selectedPhoto.url}
                                alt={item.product.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                No image
                            </div>
                        )}
                    </div>

                    {photos.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {photos.map((photo, photoIndex) => (
                                <button
                                    key={`${photo.url}-${photoIndex}`}
                                    type="button"
                                    onClick={() => setSelectedPhotoIndex(photoIndex)}
                                    className={`h-14 w-14 flex-none overflow-hidden rounded-md border transition ${selectedPhotoIndex === photoIndex ? 'border-[#1A0089] ring-2 ring-[#1A0089]/20' : 'border-slate-200'}`}
                                >
                                    <img src={photo.url} alt={`${item.product.title} ${photoIndex + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-2xl font-bold tracking-tight">{item.product.title}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-y py-4">
                        <div>
                            <p className="text-xs uppercase text-muted-foreground">Item price</p>
                            <p className="font-semibold mt-1">{formatCurrency(item.price)}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-muted-foreground">Quantity</p>
                            <p className="font-semibold mt-1">{item.quantity}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-muted-foreground">Selected size</p>
                            <p className="font-semibold mt-1">{selectedSize}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-muted-foreground">Colour</p>
                            <p className="font-semibold mt-1 inline-flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: colourHash }} />
                                <span>{colourName}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}