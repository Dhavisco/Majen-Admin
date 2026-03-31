import { notFound } from 'next/navigation'
import { FaBan, FaCheckCircle, FaMinusCircle } from 'react-icons/fa'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { clients } from '@/app/dashboard/clients/data'

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
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-xl font-semibold">
                                {getInitials(client.name)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold uppercase">{client.name}</h1>
                                <p className="text-white/80 text-sm mt-1">
                                    {client.email} - {client.location}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge className="bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20">{client.status}</Badge>
                                    {client.flags.length > 0 && (
                                        <Badge className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/20">
                                            {client.flags.length} flagged
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full md:w-auto">
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{client.lifetimeOrders}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Orders</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{client.totalValue}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Total Spent</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{client.averageOrder}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Avg Order</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <section className="xl:col-span-2 space-y-4">
                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Client information</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                                    <p className="font-semibold mt-1">{client.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                                    <p className="font-semibold mt-1">{client.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Location</p>
                                    <p className="font-semibold mt-1">{client.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Preferred category</p>
                                    <p className="font-semibold mt-1">{client.preferredCategory}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Member since</p>
                                    <p className="font-semibold mt-1">{client.joined}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Last active</p>
                                    <p className="font-semibold mt-1">{client.lastActive}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Admin notes</div>
                            <div className="p-4 space-y-3">
                                {client.notes.map((note, index) => (
                                    <div key={index} className="rounded-lg border p-3 bg-gray-50">
                                        <p className="text-sm font-medium">{note.text}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{note.meta}</p>
                                    </div>
                                ))}
                                <textarea
                                    placeholder="Add a note visible to all admins..."
                                    className="w-full h-24 rounded-lg border p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#1A0089]/30"
                                />
                                <Button className="w-full bg-[#1A0089] hover:bg-[#14006b]">Save note</Button>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-4">
                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Flags ({client.flags.length})</div>
                            <div className="p-4 space-y-2">
                                {client.flags.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No active flags.</p>
                                )}
                                {client.flags.map((flag, index) => (
                                    <div key={index} className="grid grid-cols-[70px_1fr_auto] items-center gap-2 text-sm rounded-lg bg-gray-50 px-3 py-2">
                                        <span className="text-muted-foreground">{flag.date}</span>
                                        <span>{flag.reason}</span>
                                        <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50">
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-red-200 bg-red-50/30 overflow-hidden">
                            <div className="px-4 py-3 border-b border-red-200">
                                <p className="font-semibold text-red-700">Account actions</p>
                                <p className="text-xs text-red-600 mt-1">Changes take effect immediately</p>
                            </div>
                            <div className="p-4 space-y-2">
                                <Button variant="outline" className="w-full justify-start border-green-300 text-green-700 hover:bg-green-50">
                                    <FaCheckCircle className="mr-2" /> Mark active
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50">
                                    <FaMinusCircle className="mr-2" /> Suspend account
                                </Button>
                                <Button className="w-full justify-start bg-red-600 hover:bg-red-700 text-white">
                                    <FaBan className="mr-2" /> Ban account
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    )
}
