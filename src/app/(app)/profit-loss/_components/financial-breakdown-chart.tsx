
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { name: "Bid Amount", value: 5770758, fill: "var(--color-bid)" },
  { name: "Budget", value: 4920565, fill: "var(--color-budget)" },
  { name: "Expenses", value: 0, fill: "var(--color-expenses)" },
  { name: "Actual Profit", value: 5770758, fill: "var(--color-actualProfit)" },
  { name: "Estimated Profit", value: 850193, fill: "var(--color-estimatedProfit)" },
];

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
}

export function FinancialBreakdownChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis 
          tickFormatter={(value) => Number(value).toLocaleString()}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="value" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
