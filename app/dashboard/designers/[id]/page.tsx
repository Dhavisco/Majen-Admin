import { notFound } from 'next/navigation'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { designers } from '@/app/dashboard/designers/data'
import DesignerProfileTabs from '@/app/dashboard/designers/[id]/DesignerProfileTabs'

type PageProps = {
    params: Promise<{ id: string }>
}

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

export default async function DesignerProfilePage({ params }: PageProps) {
    const { id } = await params
    const designer = designers.find((item) => String(item.id) === id)

    if (!designer) {
        notFound()
    }

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-[#1A0089] p-4 md:p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-lg sm:text-xl font-semibold">
                                {getInitials(designer.name)}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold uppercase leading-tight wrap-break-word">{designer.name}</h1>
                                <p className="text-white/80 text-xs sm:text-sm mt-1 wrap-break-word">
                                    {designer.business} - {designer.type}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge className="bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20">{designer.status}</Badge>
                                    {designer.flags.length > 0 && (
                                        <Badge className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/20">
                                            {designer.flags.length} flagged
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:w-auto">
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.products}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Products</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.orders}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Orders</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.revenue}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Revenue</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{designer.rating}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Rating</p>
                            </div>
                        </div>
                    </div>
                </section>

                <DesignerProfileTabs designer={designer} />
            </div>
        </DashboardLayout>
    )
}
