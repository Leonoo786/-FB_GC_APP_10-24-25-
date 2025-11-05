'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Expense } from '@/lib/types';
import { format } from 'date-fns';

export function TransactionsDialog({
  open,
  onOpenChange,
  category,
  expenses,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  expenses: Expense[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transactions for {category}</DialogTitle>
          <DialogDescription>
            A list of all recorded expenses for this budget category.
          </DialogDescription>
        </DialogHeader>
        <div class="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {format(new Date(expense.date), 'PP')}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.vendorName}</TableCell>
                  <TableCell class="text-right">
                    {expense.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} class='text-center text-muted-foreground py-8'>
                        No expenses recorded for this category yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

    