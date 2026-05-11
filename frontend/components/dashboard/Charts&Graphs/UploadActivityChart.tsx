"use client"

import { TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Event media activity overview"

const chartData = [
  { time: "13:00", uploads: 42 },
  { time: "14:00", uploads: 128 },
  { time: "15:00", uploads: 310 },
  { time: "16:00", uploads: 520 },
]

const chartConfig = {
  uploads: {
    label: "Uploads",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function UploadActivityChart() {
  return (
    <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">
          Event Activity
        </CardTitle>
        <CardDescription>
          Image upload activity across the event lifecycle (3-day session)
        </CardDescription>
      </CardHeader>

      {/* ✅ FIX 1: เพิ่มพื้นที่จริงให้ chart */}
      <CardContent className="h-[240px] sm:h-[260px] md:h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 20, bottom: 45 }} // ✅ FIX 2
            >
              <CartesianGrid vertical={false} opacity={0.3} />

              {/* ✅ FIX 3: padding + dx + ลดการโดน clip */}
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 12 }}
                angle={-25}
                textAnchor="end"
                height={60}
                dx={4}
                padding={{ left: 10, right: 10 }}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" hideLabel />}
              />

              <Line
                dataKey="uploads"
                type="monotone"
                stroke="var(--color-uploads)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Peak activity detected on Day 2 during main ceremony
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Tracking guest photo uploads throughout the event timeline
        </div>
      </CardFooter>
    </Card>
  )
}