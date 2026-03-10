const bars = [40, 64, 52, 78, 46, 58, 48];

export function DashboardPreview() {
    return (
        <div className="hero-shadow rounded-[28px] border border-white/70 bg-[rgba(255,255,255,0.88)] p-5 backdrop-blur xl:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-[rgba(17,25,47,0.06)] pb-4">
                <span className="h-3 w-3 rounded-full bg-[#ff7d72]" />
                <span className="h-3 w-3 rounded-full bg-[#f5c451]" />
                <span className="h-3 w-3 rounded-full bg-[#5ed69a]" />
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    admin.majen.internal/dashboard
                </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#f0eef7] p-4">
                    <div className="h-2.5 w-12 rounded-full bg-[rgba(26,0,137,0.18)]" />
                    <div className="mt-3 h-4 w-20 rounded bg-[rgba(26,0,137,0.4)]" />
                </div>
                <div className="rounded-2xl bg-[#e9f5f2] p-4">
                    <div className="h-2.5 w-12 rounded-full bg-[#bde3d7]" />
                    <div className="mt-3 h-4 w-14 rounded bg-[#76d0b6]" />
                </div>
                <div className="rounded-2xl bg-[#f7f1e6] p-4">
                    <div className="h-2.5 w-12 rounded-full bg-[#f2d8a5]" />
                    <div className="mt-3 h-4 w-14 rounded bg-[#e7bf69]" />
                </div>
            </div>

            <div className="mt-4 rounded-3xl bg-[#eff1f5] p-5">
                <div className="mb-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/70 px-4 py-3">
                        <div className="h-2 w-10 rounded-full bg-[rgba(26,0,137,0.14)]" />
                        <div className="mt-3 h-4 w-16 rounded bg-[rgba(26,0,137,0.24)]" />
                    </div>
                    <div className="rounded-2xl bg-white/70 px-4 py-3">
                        <div className="h-2 w-12 rounded-full bg-[#cfd5e2]" />
                        <div className="mt-3 h-4 w-14 rounded bg-[#aab4c5]" />
                    </div>
                    <div className="rounded-2xl bg-white/70 px-4 py-3">
                        <div className="h-2 w-10 rounded-full bg-[#d9d7f3]" />
                        <div className="mt-3 h-4 w-20 rounded bg-[#9e93dd]" />
                    </div>
                </div>

                <div className="grid h-56 grid-cols-7 items-end gap-2 sm:gap-3">
                    {bars.map((height, index) => (
                        <div
                            key={`bar-${index}-${height}`}
                            className={
                                index === 3
                                    ? "rounded-t-2xl bg-[rgba(26,0,137,0.58)]"
                                    : "rounded-t-2xl bg-[rgba(26,0,137,0.26)]"
                            }
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}