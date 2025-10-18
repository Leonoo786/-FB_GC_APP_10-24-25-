
"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Amount",
  },
  bid: {
    label: "Bid Amount",
    color: "hsl(var(--chart-1))",
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-3))",
  },
  actualProfit: {
    label: "Actual Profit",
    color: "hsl(var(--chart-4))",
  },
  estimatedProfit: {
    label: "Estimated Profit",
    color: "hsl(var(--chart-5))",
  },
} as const;

type FinancialBreakdownChartProps = {
    data: {
        bidAmount: number;
        budget: number;
        expenses: number;
        actualProfit: number;
        estimatedProfit: number;
    }
}

export function FinancialBreakdownChart({ data }: FinancialBreakdownChartProps) {
  const chartData = useMemo(() => [
      { name: "Bid Amount", value: data.bidAmount, fill: "var(--color-bid)" },
      { name: "Budget", value: data.budget, fill: "var(--color-budget)" },
      { name: "Expenses", value: data.expenses, fill: "var(--color-expenses)" },
      { name: "Actual Profit", value: data.actualProfit, fill: "var(--color-actualProfit)" },
      { name: "Estimated Profit", value: data.estimatedProfit, fill: "var(--color-estimatedProfit)" },
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
