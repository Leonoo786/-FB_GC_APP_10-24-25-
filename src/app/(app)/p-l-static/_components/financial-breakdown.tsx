
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BreakdownItemProps = {
  label: string;
  value: number;
  total: number;
  colorClass: string;
};

const BreakdownItem = ({
  label,
  value,
  total,
  colorClass,
}: BreakdownItemProps) => {
  const percentage = total > 0 ? (Math.abs(value) / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>
          {value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </span>
      </div>
      <div className="h-4 w-full rounded-full bg-secondary">
        <div
          className={`h-4 rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

type FinancialBreakdownProps = {
    budget: number;
    expenses: number;
    actualProfit: number;
};


export function FinancialBreakdown({ budget, expenses, actualProfit }: FinancialBreakdownProps) {
  const maxVal = Math.max(budget, expenses, Math.abs(actualProfit), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visual comparison of budget, expenses, and profit
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <BreakdownItem
          label="Total Budget"
          value={budget}
          total={maxVal}
          colorClass="bg-sky-500"
        />
        <BreakdownItem
          label="Total Expenses"
          value={expenses}
          total={maxVal}
          colorClass="bg-gray-300"
        />
        <BreakdownItem
          label="Total Actual Profit"
          value={actualProfit}
          total={maxVal}
          colorClass={actualProfit >= 0 ? "bg-emerald-500" : "bg-red-500"}
        />
      </CardContent>
    </Card>
  );
}
