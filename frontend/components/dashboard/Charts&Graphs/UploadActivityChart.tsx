"use client"

import { TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
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
  { time: "17:00", uploads: 680 },
  { time: "18:00", uploads: 740 },
  { time: "19:00", uploads: 590 },
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
          Image upload activity across the event lifecycle
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[240px] sm:h-[260px] md:h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-uploads)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-uploads)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.2}
              />

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 12 }}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Area
                dataKey="uploads"
                type="monotone"
                fill="url(#fillUploads)"
                fillOpacity={1}
                stroke="var(--color-uploads)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Peak upload traffic during evening ceremony
          <TrendingUp className="h-4 w-4" />
        </div>

        <div className="leading-none text-muted-foreground">
          Realtime guest media activity throughout the event
        </div>
      </CardFooter>
    </Card>
  )
}