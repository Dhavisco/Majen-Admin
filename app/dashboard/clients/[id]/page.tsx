import { notFound } from 'next/navigation'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { clients } from '@/app/dashboard/clients/data'
import ClientProfileTabs from '@/app/dashboard/clients/[id]/ClientProfileTabs'

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

const statusBadgeClass: Record<string, string> = {
    Active: 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20',
    Pending: 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/20',
    Flagged: 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/20',
    Suspended: 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/20',
    Banned: 'bg-red-500/20 text-red-200 hover:bg-red-500/20',
}

export default async function ClientProfilePage({ params }: PageProps) {
    const { id } = await params
    const client = clients.find((item) => String(item.id) === id)

    if (!client) {
        notFound()
    }

    return (
        <DashboardLayout>
            <div className="space-y-4 md:space-y-6 md:p-0">
                <section className="rounded-2xl border bg-[#1A0089] p-4 md:p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-lg sm:text-xl font-semibold">
                                {getInitials(client.name)}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold uppercase leading-tight wrap-break-word">{client.name}</h1>
                                <p className="text-white/80 text-xs sm:text-sm mt-1 wrap-break-word">
                                    Client since {client.joined}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge className={statusBadgeClass[client.status] ?? 'bg-white/20 text-white hover:bg-white/20'}>{client.status}</Badge>
                                    {client.flags.length > 0 && (
                                        <Badge className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/20">
                                            {client.flags.length} flagged
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <ClientProfileTabs client={client} />
            </div>
        </DashboardLayout>
    )
}
