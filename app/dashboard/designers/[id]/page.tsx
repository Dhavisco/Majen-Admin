import { notFound } from 'next/navigation'
import { FaFlag, FaCheckCircle, FaBan, FaMinusCircle } from 'react-icons/fa'

import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { designers } from '@/app/dashboard/designers/data'

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
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-xl font-semibold">
                                {getInitials(designer.name)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold uppercase">{designer.name}</h1>
                                <p className="text-white/80 text-sm mt-1">
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
                                <p className="text-2xl font-bold">{designer.products}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Products</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{designer.orders}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Orders</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{designer.revenue}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Revenue</p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-center">
                                <p className="text-2xl font-bold">{designer.rating}</p>
                                <p className="text-[10px] uppercase tracking-wider text-white/70">Rating</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <section className="xl:col-span-2 space-y-4">
                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Business information</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Registered name</p>
                                    <p className="font-semibold mt-1">{designer.registeredName}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">CAC RC number</p>
                                    <p className="font-semibold mt-1">{designer.cac}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Display name</p>
                                    <p className="font-semibold mt-1">{designer.business}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Business type</p>
                                    <p className="font-semibold mt-1">{designer.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                                    <p className="font-semibold mt-1">{designer.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Member since</p>
                                    <p className="font-semibold mt-1">{designer.joined}</p>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    {designer.socials.map((social) => (
                                        <a
                                            key={social.platform + social.handle}
                                            href={social.url}
                                            className="text-sm text-[#1A0089] hover:underline block"
                                        >
                                            {social.handle}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Admin notes</div>
                            <div className="p-4 space-y-3">
                                {designer.notes.map((note, index) => (
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
                            <div className="px-4 py-3 border-b flex items-center justify-between">
                                <span className="font-semibold">Balance</span>
                                <button className="text-sm text-[#1A0089] hover:underline">History -</button>
                            </div>
                            <div className="p-4 border-b">
                                <p className="text-sm text-muted-foreground">Current balance</p>
                                <p className="text-3xl font-bold text-[#1A0089] mt-1">{designer.balance}</p>
                            </div>
                            <div className="p-4 space-y-2">
                                {designer.recentMovements.map((movement, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                        <span>{movement.label}</span>
                                        <span className={movement.kind === 'credit' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                            {movement.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b font-semibold">Flags ({designer.flags.length})</div>
                            <div className="p-4 space-y-2">
                                {designer.flags.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No active flags.</p>
                                )}
                                {designer.flags.map((flag, index) => (
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
                                    <FaCheckCircle className="mr-2" /> Remove all flags
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50">
                                    <FaMinusCircle className="mr-2" /> Suspend account
                                </Button>
                                <Button className="w-full justify-start bg-red-600 hover:bg-red-700 text-white">
                                    <FaBan className="mr-2" /> Ban account
                                </Button>
                                <Button variant="outline" disabled className="w-full justify-start">
                                    <FaFlag className="mr-2" /> Already verified
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    )
}
