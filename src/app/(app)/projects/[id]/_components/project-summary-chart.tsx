
'use client';

import {
  ChartContainer,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

type ProjectSummaryChartProps = {
  data: ChartData[];
  label: string;
  metric: string;
  metricLabel: string;
};

export function ProjectSummaryChart({ data, label, metric, metricLabel }: ProjectSummaryChartProps) {
  return (
    <div class="flex items-center gap-2 text-sm">
      <div class="h-16 w-16">
        <ChartContainer
          config={{}}
          class="min-h-0 w-full h-full p-0 [&>div]:h-full"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={18}
              outerRadius={24}
              strokeWidth={2}
            >
                {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div>
        <p class="text-muted-foreground">{label}</p>
        <p class="font-bold text-lg">{metric}</p>
        <p class="text-xs text-muted-foreground">{metricLabel}</p>
      </div>
    </div>
  );
}
