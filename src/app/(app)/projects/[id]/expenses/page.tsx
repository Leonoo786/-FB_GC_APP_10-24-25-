
'use client';

import { useState, use, useContext, useRef, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, PlusCircle, ArrowUpDown, Upload, Trash2 } from 'lucide-react';
import { AddEditExpenseDialog } from '../_components/add-edit-expense-dialog';
import { format, isValid } from 'date-fns';
import { AppStateContext } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import type { Expense } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import * as XLSX from 'xlsx';
import { Checkbox } from '@/components/ui/checkbox';

export default function ProjectExpensesPage({
  params: paramsProp,
}: {
  params: Promise<{ id: string }>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc'});
  const params = use(paramsProp);
  const appState = useContext(AppStateContext);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!appState) {
    return <div>Loading...</div>;
  }
  const { expenses, budgetCategories, setExpenses } = appState;
  const projectExpenses = expenses ? expenses.filter(
    (exp) => exp.projectId === params.id
  ) : [];

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
    if (selectedExpense && expense.id) {
        // Edit
        setExpenses(current => current.map(e => e.id === expense.id ? expense : e));
    } else {
        // Add
        setExpenses(current => [{...expense, id: crypto.randomUUID()}, ...current]);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !appState) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert to array of arrays, ignoring headers
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (rows.length < 2) {
            toast({
                title: 'Import Warning',
                description: 'The file is empty or only contains a header row.',
                variant: 'destructive',
            });
            return;
        }

        const dataRows = rows.slice(1);
        
        const parseAmount = (value: any): number => {
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
              const cleaned = value.replace(/[^0-9.-]+/g, '');
              const num = parseFloat(cleaned);
              return isNaN(num) ? 0 : num;
            }
            return 0;
        };

        const parseDate = (value: any): Date | null => {
            if (!value) return null;
            const date = new Date(value);
            return isValid(date) ? date : null;
        }

        const newExpenses = dataRows.map((row): Expense | null => {
            const date = parseDate(row[0]);
            const amount = parseAmount(row[7]);
            
            if (!date || !amount) {
                return null; // Skip invalid rows
            }

            return {
                id: crypto.randomUUID(),
                projectId: params.id,
                date: format(date, 'yyyy-MM-dd'),
                category: row[1] || 'Uncategorized',
                vendorName: row[2] || '',
                description: row[3] || 'N/A',
                paymentMethod: row[4] || 'N/A',
                paymentReference: row[5] || '',
                invoiceNumber: row[6] || '',
                amount: amount,
            };
        }).filter((item): item is Expense => item !== null);
        
        if (newExpenses.length > 0) {
            setExpenses((current) => [...current, ...newExpenses]);
            toast({
                title: 'Import Successful',
                description: `${newExpenses.length} expenses have been imported.`,
            });
        } else {
            toast({
                title: 'Import Warning',
                description: `Could not import any valid expenses. Please check your file's format and column content.`,
                variant: 'destructive',
            });
        }

      } catch (error) {
        console.error("Error importing expenses:", error);
        toast({
            title: "Import Failed",
            description: "There was an error processing the file.",
            variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);

    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <AddEditExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={params.id}
        expense={selectedExpense}
        onSave={handleSaveExpense}
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Daily Expenses</CardTitle>
              <CardDescription>
                Log and track daily expenses for this project.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
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
              ) : (
                <>
                   <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {budgetCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleImportClick}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                  </Button>
                </>
              )}
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
                   <Button variant="ghost" onClick={() => requestSort('category')}>
                    Category
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
                  <TableCell>{expense.category}</TableCell>
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
                  <TableCell colSpan={10} className="text-center h-24">
                    No expenses recorded for this project yet.
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
