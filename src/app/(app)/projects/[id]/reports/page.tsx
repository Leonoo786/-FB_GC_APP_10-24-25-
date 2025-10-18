
'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { budgetItems, expenses, projects } from '@/lib/data';
import type { BudgetItem, Expense } from '@/lib/types';
import { TransactionsDialog } from '../_components/transactions-dialog';
import { cn } from '@/lib/utils';

export default function ProjectReportsPage({
  params: paramsProp,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showGroupByCategory, setShowGroupByCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = use(paramsProp);
  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    notFound();
  }

  const projectBudgetItems = budgetItems.filter(
    (item) => item.projectId === project.id
  );

  const getExpensesForCategory = (category: string) => {
    return expenses.filter(
      (expense) =>
        expense.projectId === project.id && expense.category === category
    );
  };

  const handleTransactionsClick = (category: string) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };
  
  const categoryColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Top Spending Categories</CardTitle>
              <CardDescription>
                A summary of spending by budget category for this project.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="group-by-category"
                checked={showGroupByCategory}
                onCheckedChange={setShowGroupByCategory}
              />
              <Label htmlFor="group-by-category">Group by Category</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="w-[150px]">Progress Chart</TableHead>
                <TableHead className="text-center w-[120px]">Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectBudgetItems.map((item, index) => {
                const budget = item.originalBudget + item.approvedCOBudget;
                const spent = getExpensesForCategory(item.category).reduce(
                  (acc, exp) => acc + exp.amount,
                  0
                );
                const balance = budget - spent;
                const progress = budget > 0 ? (spent / budget) * 100 : 0;
                const transactions = getExpensesForCategory(item.category);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <span className={cn("h-2.5 w-2.5 rounded-full", categoryColors[index % categoryColors.length])} />
                        <span className="font-medium">{item.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {budget.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {spent.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {balance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Progress value={progress} className="h-2" />
                        <span className='text-xs text-muted-foreground'>{progress.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransactionsClick(item.category)}
                        disabled={transactions.length === 0}
                      >
                        {transactions.length} items
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedCategory && (
        <TransactionsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          category={selectedCategory}
          expenses={getExpensesForCategory(selectedCategory)}
        />
      )}
    </>
  );
}
