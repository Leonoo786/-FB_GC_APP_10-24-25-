
'use client';

import { Flag } from 'lucide-react';
import {
  ChartContainer,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

type MilestoneProgressProps = {
  value: number;
  total: number;
};

export function MilestoneProgress({ value, total }: MilestoneProgressProps) {
  const progress = total > 0 ? (value / total) * 100 : 0;
  
  const chartData = [
    { name: 'Completed', value: value, fill: 'hsl(var(--primary))' },
    { name: 'Remaining', value: Math.max(0, total - value), fill: 'hsl(var(--muted))' }
  ];

  return (
    <div className="flex flex-col items-center text-sm relative">
       <div className="h-20 w-20">
        <ChartContainer
          config={{}}
          className="min-h-0 w-full h-full p-0 [&>div]:h-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={24}
              outerRadius={32}
              strokeWidth={2}
              startAngle={90}
              endAngle={450}
            >
                {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
         <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flag className="h-5 w-5 text-muted-foreground" />
         </div>
      </div>
      <p className="font-bold text-lg">{value}/{total}</p>
      <p className="text-xs text-muted-foreground">Milestones</p>
    </div>
  );
}
