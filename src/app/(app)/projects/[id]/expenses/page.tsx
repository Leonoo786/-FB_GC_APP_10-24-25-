
'use client';

import { useState, use, useContext, useRef } from 'react';
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
import { MoreHorizontal, PlusCircle, ArrowUpDown, Upload } from 'lucide-react';
import { AddEditExpenseDialog } from '../_components/add-edit-expense-dialog';
import { format } from 'date-fns';
import { AppStateContext } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import type { Expense } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ProjectExpensesPage({
  params: paramsProp,
}: {
  params: Promise<{ id: string }>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
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
    if (file && appState) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                const newExpenses: Expense[] = json.map((row: any) => {
                    // Similar to budget import, we assume specific column names
                    // and handle potential missing values with defaults.
                    const amount = Number(row['Amount']) || 0;
                    
                    // The 'cellDates: true' option should parse dates, but we add a fallback.
                    let date = new Date();
                    if (row['Date']) {
                      if (row['Date'] instanceof Date) {
                        date = row['Date'];
                      } else if (typeof row['Date'] === 'number') {
                         // Handle Excel serial date number
                        date = XLSX.SSF.parse_date_code(row['Date']);
                      } else {
                        date = new Date(row['Date']);
                      }
                    }

                    if (amount <= 0 || isNaN(date.getTime())) {
                        return null; 
                    }

                    return {
                      id: crypto.randomUUID(),
                      projectId: params.id,
                      date: format(date, 'yyyy-MM-dd'),
                      category: row['Category'] || 'Uncategorized',
                      vendorName: row['Vendor'] || '',
                      description: row['Description'] || 'N/A',
                      amount: amount,
                      paymentMethod: row['Payment Method'] || 'N/A',
                      paymentReference: String(row['Payment Reference'] || ''),
                      invoiceNumber: String(row['Invoice Number'] || ''),
                    };
                  })
                  .filter((expense): expense is Expense => expense !== null);
                
                if (newExpenses.length > 0) {
                  setExpenses(current => [...current, ...newExpenses]);
                }

                toast({
                    title: "Import Successful",
                    description: `${newExpenses.length} expenses have been imported.`,
                });
            } catch (error) {
                console.error("Error importing expenses:", error);
                const errorMessage = (error instanceof Error) ? error.message : "Please check file format and column headers.";
                toast({
                    title: "Import Failed",
                    description: `There was an error processing the file. ${errorMessage}`,
                    variant: "destructive",
                });
            }
        };
        reader.readAsBinaryString(file);
    }
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
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
                <TableHead>
                  <Button variant="ghost">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                   <Button variant="ghost">
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost">
                    Vendor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost">
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectExpenses.map((expense) => (
                <TableRow key={expense.id}>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
