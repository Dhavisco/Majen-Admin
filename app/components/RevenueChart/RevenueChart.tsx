// // components/RevenueChart/RevenueChart.tsx
// "use client"
// import {
//     CartesianGrid,
//     XAxis,
//     YAxis,
//     BarChart,
//     Bar,
// } from "recharts"

// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"   // ← adjust path if your shadcn components are elsewhere

// // ── Sample data (replace with real data later, e.g. from React Query)
// const chartData = [
//     { month: "Oct", revenue: 10 },
//     { month: "Nov", revenue: 15 },
//     { month: "Dec", revenue: 20 },
//     { month: "Jan", revenue: 25 },
//     { month: "Feb", revenue: 30 },
//     { month: "Mar", revenue: 35 },
// ]

// // ── Chart config – controls labels + colors via CSS vars
// const chartConfig = {
//     revenue: {
//         label: "Revenue (₦M)",
//         color: "hsl(var(--chart-1))",           // uses your theme's --chart-1
//         // or use: theme: { light: "#4F46E5", dark: "#6366f1" }
//     },
// } satisfies ChartConfig

// export default function RevenueChart() {
//     return (


//         <div className="bg-white shadow rounded-lg p-4">
//             <h3 className="text-lg font-bold mb-4">Revenue</h3>
//             <p>Last 6 months (₦ millions)</p>

//             <hr className="my-4 border-t" />

//             <ChartContainer
//                 config={chartConfig}
//                 className="h-70 w-full"   // adjust height as needed
//             >
//                 <BarChart
//                     data={chartData}
//                     margin={{
//                         top: 12,
//                         right: 16,
//                         left: 0,
//                         bottom: 8,
//                     }}
//                 >
//                     <CartesianGrid vertical={false} strokeDasharray="3 3" />

//                     <XAxis
//                         dataKey="month"
//                         tickLine={false}
//                         axisLine={false}
//                         tickMargin={8}
//                         tickFormatter={(value) => value}
//                     />

//                     <YAxis
//                         tickLine={false}
//                         axisLine={false}
//                         tickMargin={8}
//                         tickFormatter={(value) => `${value}M`}
//                     />

//                     <ChartTooltip
//                         cursor={false}
//                         content={<ChartTooltipContent indicator="line" />}   // "dot" | "line" | "dashed"
//                     />

//                     <Bar
//                         dataKey="revenue"
//                         fill="#1A0089" //#E4E0F8
//                         radius={[4, 4, 0, 0]}
//                     />

//                 </BarChart>
//             </ChartContainer>

//         </div>
//     )


// }

"use client"

import { useState } from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    XAxis,
    YAxis,
} from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart" // adjust path as needed

// Sample data
const chartData = [
    { month: "Oct", revenue: 10 },
    { month: "Nov", revenue: 15 },
    { month: "Dec", revenue: 20 },
    { month: "Jan", revenue: 25 },
    { month: "Feb", revenue: 30 },
    { month: "Mar", revenue: 35 },
    { month: "Apr", revenue: 38 },
    { month: "May", revenue: 40 },
    { month: "Jun", revenue: 45 },
]

// Colors (hex – no need for CSS vars here unless you want theme switching)
const HIGHLIGHT_COLOR = "#1A0089"     // top 2 bars + hover
const NORMAL_COLOR = "#E4E0F8"      // others

// Chart config (still useful for tooltip label)
const chartConfig = {
    revenue: {
        label: "Revenue (₦M)",
        color: HIGHLIGHT_COLOR, // fallback / tooltip accent
    },
} satisfies ChartConfig

export default function RevenueChart() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // Find the two highest revenue values dynamically
    const revenueValues = chartData.map(item => item.revenue)
    const sortedValues = [...revenueValues].sort((a, b) => b - a)
    const topTwoThreshold = sortedValues[1] // second highest (or equal if ties)

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Revenue</h3>
            <p className="text-sm text-muted-foreground mb-4">Last 6 months (₦ millions)</p>
            <hr className="my-4 border-t border-border" />

            <ChartContainer config={chartConfig} className="h-70 w-full">
                <BarChart
                    data={chartData}
                    margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="6 4"           // longer dashes → more visible
                        stroke="#d1d5db"                // gray-300, clearly visible but not harsh
                    />

                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `${value}M`}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            indicator="dashed"
                            labelFormatter={(v) => `${v}`}
                        // valueFormatter={(v) => `${v}M ₦`}
                        />}
                    />

                    <Bar
                        dataKey="revenue"
                        radius={[4, 4, 0, 0]}
                        onMouseEnter={(_, index) => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {chartData.map((entry, index) => {
                            const isTop = entry.revenue >= topTwoThreshold
                            const isHovered = hoveredIndex === index

                            let fillColor = NORMAL_COLOR
                            if (isTop) fillColor = HIGHLIGHT_COLOR
                            if (isHovered) fillColor = HIGHLIGHT_COLOR // override on hover

                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={fillColor}
                                />
                            )
                        })}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    )
}