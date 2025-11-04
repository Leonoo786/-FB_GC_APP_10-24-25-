
'use client';

import { useState, useContext, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, ArrowUpDown, Trash2 } from 'lucide-react';
import { AddEditExpenseDialog } from '../_components/add-edit-expense-dialog';
import { format } from 'date-fns';
import { AppStateContext } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import type { Expense } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from '@/components/ui/checkbox';

export function GetReimbursedClientPage({
  projectId,
}: {
  projectId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc'});
  const appState = useContext(AppStateContext);
  const { toast } = useToast();

  if (!appState) {
    return <div>Loading...</div>;
  }
  const { expenses, setExpenses } = appState;
  
  const projectExpenses = useMemo(() => expenses.filter(
    (exp) => exp.projectId === projectId && exp.category === 'Get Reimbursed'
  ), [expenses, projectId]);


  const sortedExpenses = useMemo(() => {
    let sortableItems = [...projectExpenses];
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [projectExpenses, sortConfig]);

  const requestSort = (key: keyof Expense) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const handleNewExpense = () => {
    setSelectedExpense(null);
    setDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setDialogOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(current => current.filter(exp => exp.id !== expenseId));
    toast({
        title: "Expense Deleted",
        description: "The expense has been successfully deleted.",
        variant: "destructive"
    });
  };

  const handleDeleteSelected = () => {
    setExpenses(current => current.filter(exp => !selectedRowKeys.includes(exp.id)));
    toast({
        title: `${selectedRowKeys.length} Expenses Deleted`,
        description: "The selected expenses have been successfully deleted.",
        variant: "destructive"
    });
    setSelectedRowKeys([]);
  }

  const handleSaveExpense = (expense: Expense) => {
    const expenseToSave = { ...expense, category: 'Get Reimbursed' };
    if (selectedExpense && expense.id) {
        // Edit
        setExpenses(current => current.map(e => e.id === expenseToSave.id ? expenseToSave : e));
    } else {
        // Add
        setExpenses(current => [{...expenseToSave, id: crypto.randomUUID()}, ...current]);
    }
  };

  return (
    <>
      <AddEditExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={projectId}
        expense={selectedExpense}
        onSave={handleSaveExpense}
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Get Reimbursed</CardTitle>
              <CardDescription>
                Track and manage reimbursable expenses for this project.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {selectedRowKeys.length > 0 ? (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete ({selectedRowKeys.length})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete {selectedRowKeys.length} expense(s).
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              ) : null}
              <Button
                onClick={handleNewExpense}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                 <TableHead className="w-[40px]">
                    <Checkbox
                        checked={selectedRowKeys.length > 0 && sortedExpenses.length > 0 && selectedRowKeys.length === sortedExpenses.length}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setSelectedRowKeys(sortedExpenses.map(exp => exp.id));
                            } else {
                                setSelectedRowKeys([]);
                            }
                        }}
                        aria-label="Select all rows"
                    />
                 </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('date')}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('vendorName')}>
                    Vendor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => requestSort('amount')}>
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id} data-state={selectedRowKeys.includes(expense.id) && "selected"}>
                  <TableCell>
                      <Checkbox
                          checked={selectedRowKeys.includes(expense.id)}
                          onCheckedChange={(checked) => {
                              if (checked) {
                                  setSelectedRowKeys(prev => [...prev, expense.id]);
                              } else {
                                  setSelectedRowKeys(prev => prev.filter(id => id !== expense.id));
                              }
                          }}
                          aria-label="Select row"
                      />
                  </TableCell>
                  <TableCell>
                    {format(new Date(expense.date), 'PP')}
                  </TableCell>
                  <TableCell>{expense.vendorName}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>{expense.paymentReference}</TableCell>
                  <TableCell>{expense.invoiceNumber}</TableCell>
                  <TableCell className="text-right">
                    {expense.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditExpense(expense)}>Edit</DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this expense.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {sortedExpenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">
                    No reimbursable expenses recorded for this project yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
