
'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Project } from '@/lib/types';
import { useMemo } from 'react';
import { Label, LabelList } from 'recharts';

const chartConfig = {
  active: {
    label: 'In Progress',
    color: 'hsl(var(--chart-1))',
  },
  planning: {
    label: 'Planning',
    color: 'hsl(var(--chart-2))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-3))',
  },
  onhold: {
    label: 'On Hold',
    color: 'hsl(var(--chart-4))',
  },
  delayed: {
    label: 'Delayed',
    color: 'hsl(var(--chart-5))',
  },
};

type ProjectStatusChartProps = {
  projects: Project[];
};

export function ProjectStatusChart({ projects }: ProjectStatusChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = projects.reduce((acc, project) => {
        const key = project.status.toLowerCase().replace(/\s+/g, '');
        if (!acc[key]) {
            acc[key] = {
                status: project.status,
                count: 0,
                fill: `var(--color-${key})`
            };
        }
        acc[key].count++;
        return acc;
    }, {} as {[key: string]: {status: string, count: number, fill: string}});

    return Object.values(statusCounts);
  }, [projects]);
  
  const totalProjects = projects.length;

  return (
    <div className="flex items-center justify-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
             <Label
                content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                        <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        >
                        <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                        >
                            {totalProjects.toLocaleString()}
                        </tspan>
                        <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground"
                        >
                            Projects
                        </tspan>
                        </text>
                    );
                    }
                }}
                />
             {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
             <LabelList
              dataKey="status"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: string) => {
                const entry = chartData.find(item => item.status === value);
                if (!entry) return null;
                const percentage = totalProjects > 0 ? (entry.count / totalProjects * 100) : 0;
                if (percentage < 5) return null;
                return `${value} (${percentage.toFixed(0)}%)`
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
