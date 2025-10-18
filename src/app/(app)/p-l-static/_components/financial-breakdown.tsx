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
  const percentage = total > 0 ? (value / total) * 100 : 0;
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

export function FinancialBreakdown() {
  const bidAmount = 5770758;
  const budget = 4920565;
  const expenses = 0;
  const actualProfit = bidAmount - expenses;
  const estimatedProfit = bidAmount - budget;

  const maxVal = bidAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visual comparison of bid amount, expenses, and profit
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <BreakdownItem
          label="Total Bid Amount"
          value={bidAmount}
          total={maxVal}
          colorClass="bg-blue-600"
        />
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
          colorClass="bg-blue-600"
        />
        <BreakdownItem
          label="Total Estimated Profit"
          value={estimatedProfit}
          total={maxVal}
          colorClass="bg-sky-500"
        />
      </CardContent>
    </Card>
  );
}
