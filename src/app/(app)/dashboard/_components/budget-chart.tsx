"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { budgetItems, projects } from "@/lib/data"

const activeProjects = projects.filter(p => p.status === "In Progress");

const chartData = activeProjects.map(project => {
  const items = budgetItems.filter(item => item.projectId === project.id);
  const totalBudget = items.reduce((acc, item) => acc + item.originalBudget + item.approvedCOBudget, 0);
  const totalSpent = items.reduce((acc, item) => acc + item.committedCost, 0);
  return {
    project: project.name,
    budget: totalBudget,
    actual: totalSpent,
  };
});

const chartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-3))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
}

export function BudgetChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="project"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis 
          tickFormatter={(value) => `$${Number(value) / 1000000}M`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
        <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
