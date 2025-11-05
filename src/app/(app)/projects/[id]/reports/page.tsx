
'use client';

import { useState, useContext, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
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
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AppStateContext } from '@/context/app-state-context';
import { TransactionsDialog } from '../_components/transactions-dialog';
import { cn } from '@/lib/utils';

export default function ProjectReportsPage() {
  const params = useParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const appState = useContext(AppStateContext);
  
  const project = appState?.projects.find((p) => p.id === params.id);

  const projectBudgetItems = useMemo(() => 
    appState?.budgetItems.filter((item) => item.projectId === params.id) || [],
    [appState?.budgetItems, params.id]
  );
  
  const projectExpenses = useMemo(() =>
    appState?.expenses.filter((expense) => expense.projectId === params.id) || [],
    [appState?.expenses, params.id]
  );

  if (!project || !appState) {
    notFound();
  }

  const getExpensesForCategory = (category: string) => {
    return projectExpenses.filter((expense) => expense.category === category);
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

  const categorySpending = useMemo(() => {
    const spendingMap: {[key: string]: {budget: number, spent: number}} = {};

    projectBudgetItems.forEach(item => {
        if (!spendingMap[item.category]) {
            spendingMap[item.category] = { budget: 0, spent: 0 };
        }
        spendingMap[item.category].budget += item.originalBudget + item.approvedCOBudget;
    });

    projectExpenses.forEach(expense => {
        if (!spendingMap[expense.category]) {
            spendingMap[expense.category] = { budget: 0, spent: 0 };
        }
        spendingMap[expense.category].spent += expense.amount;
    });

    return Object.entries(spendingMap).map(([category, { budget, spent }]) => {
        let progress = 0;
        if (budget > 0) {
            progress = (spent / budget) * 100;
        } else if (spent > 0) {
            progress = 100; // Over budget
        }

        return {
            category,
            budget,
            spent,
            balance: budget - spent,
            progress,
            isOverBudget: budget === 0 && spent > 0,
            transactions: getExpensesForCategory(category)
        }
    }).sort((a, b) => b.spent - a.spent);

  }, [projectBudgetItems, projectExpenses]);


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
              {categorySpending.map((item, index) => (
                  <TableRow key={item.category}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <span className={cn("h-2.5 w-2.5 rounded-full", categoryColors[index % categoryColors.length])} />
                        <span className="font-medium">{item.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.budget.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {item.spent.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.balance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Progress value={item.progress} className={cn("h-2", item.isOverBudget && "[&>div]:bg-red-600")} />
                        <span className='text-xs text-muted-foreground'>{item.progress > 0 ? item.progress.toFixed(1) : '0.0'}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransactionsClick(item.category)}
                        disabled={item.transactions.length === 0}
                      >
                        {item.transactions.length} items
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
