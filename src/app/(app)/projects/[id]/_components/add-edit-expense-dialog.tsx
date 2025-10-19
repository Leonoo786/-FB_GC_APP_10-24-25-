

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useContext, useEffect } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import type { Expense } from '@/lib/types';

const formSchema = z.object({
  date: z.date({ required_error: 'Please select a date.' }),
  category: z.string({ required_error: 'Please select a category.' }),
  vendor: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number.'),
  paymentMethod: z.string({ required_error: 'Please select a payment method.' }),
  paymentReference: z.string().optional(),
  invoiceNumber: z.string().optional(),
});

type AddExpenseFormValues = z.infer<typeof formSchema>;

export function AddEditExpenseDialog({
  open,
  onOpenChange,
  projectId,
  expense,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  expense: Expense | null;
  onSave: (expense: Expense) => void;
}) {
  const { toast } = useToast();
  const appState = useContext(AppStateContext);
  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(formSchema),
  });

  const paymentMethod = form.watch('paymentMethod');
  const isEditing = !!expense;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.reset({
          date: new Date(expense.date),
          category: expense.category,
          vendor: expense.vendorName,
          description: expense.description,
          amount: expense.amount,
          paymentMethod: expense.paymentMethod,
          paymentReference: expense.paymentReference,
          invoiceNumber: expense.invoiceNumber,
        });
      } else {
        form.reset({
            date: new Date(),
            description: '',
            paymentReference: '',
            invoiceNumber: '',
            category: undefined,
            vendor: undefined,
            paymentMethod: undefined,
            amount: 0,
        });
      }
    }
  }, [expense, isEditing, open, form]);

  const onSubmit = (data: AddExpenseFormValues) => {
    if (!appState) return;
    
    const expenseToSave: Expense = {
      id: expense?.id || '',
      projectId,
      date: format(data.date, 'yyyy-MM-dd'),
      category: data.category,
      vendorName: data.vendor,
      description: data.description,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentReference: data.paymentReference,
      invoiceNumber: data.invoiceNumber,
    };

    onSave(expenseToSave);

    toast({
      title: `Expense ${isEditing ? 'Updated' : 'Added'}`,
      description: `Successfully ${isEditing ? 'updated' : 'added'} expense for ${data.description}.`,
    });
    onOpenChange(false);
  };

  if (!appState) return null;
  const { budgetCategories, vendors } = appState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Expense</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of this expense.' : 'Log a new expense for this project.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6 pl-1">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a budget category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgetCategories
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendors
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.name}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Concrete Mix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Company Credit Card">Company Credit Card</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                       <SelectItem value="ACH">ACH</SelectItem>
                      <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(paymentMethod === 'Check' || paymentMethod === 'Company Credit Card') && (
                 <FormField
                    control={form.control}
                    name="paymentReference"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{paymentMethod === 'Check' ? 'Check Number' : 'Last 4 Digits'}</FormLabel>
                        <FormControl>
                            <Input placeholder={paymentMethod === 'Check' ? 'e.g., 12345' : 'e.g., 1234'} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}

             <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice # (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., INV-124" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
