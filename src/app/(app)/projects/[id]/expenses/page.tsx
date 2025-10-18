
'use client';

import { useState, use } from 'react';
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
import { AddExpenseDialog } from '../_components/add-expense-dialog';
import { format } from 'date-fns';
import { useContext } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';

export default function ProjectExpensesPage({
  params: paramsProp,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const params = use(paramsProp);
  const appState = useContext(AppStateContext);
  const { toast } = useToast();

  if (!appState) {
    return <div>Loading...</div>;
  }
  const { expenses, budgetCategories } = appState;
  const projectExpenses = expenses ? expenses.filter(
    (exp) => exp.projectId === params.id
  ) : [];

  const handleImport = () => {
    toast({
      title: "Import from Excel",
      description: "This functionality will allow you to import expenses from an Excel sheet.",
    });
  };

  return (
    <>
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
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
               <Button variant="outline" onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
              </Button>
              <Button
                onClick={() => setIsAddExpenseOpen(true)}
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
                <TableHead>Payment</TableHead>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
