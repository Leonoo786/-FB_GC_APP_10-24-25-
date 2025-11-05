
"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Amount",
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Spent so far",
    color: "hsl(var(--chart-3))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-4))",
  },
} as const;

type FinancialBreakdownChartProps = {
    data: {
        budget: number;
        expenses: number;
        remaining: number;
    }
}

export function FinancialBreakdownChart({ data }: FinancialBreakdownChartProps) {
  const chartData = useMemo(() => [
      { name: "Budget", value: data.budget, fill: "var(--color-budget)" },
      { name: "Spent so far", value: data.expenses, fill: "var(--color-expenses)" },
      { name: "Remaining", value: data.remaining, fill: "var(--color-remaining)" },
  ], [data]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            />
            <YAxis 
            tickFormatter={(value) => `$${Number(value) / 1000}k`}
            />
            <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="value" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
