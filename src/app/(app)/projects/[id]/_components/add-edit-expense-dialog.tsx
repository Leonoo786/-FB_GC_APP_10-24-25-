
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
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isValid, parse } from 'date-fns';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import type { Expense, Vendor } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const formSchema = z.object({
  date: z.date({ required_error: 'Please select a date.' }),
  category: z.string().min(1, 'Category is required.'),
  vendor: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number.'),
  paymentMethod: z.string({ required_error: 'Please select a payment method.' }),
  paymentReference: z.any().optional(),
  invoiceNumber: z.string().optional(),
});

type AddExpenseFormValues = z.infer<typeof formSchema>;

const tryParseDate = (dateString: string): Date | null => {
    const formats = ['PPP', 'MM/dd/yyyy', 'MM-dd-yyyy', 'yyyy-MM-dd'];
    for (const fmt of formats) {
        const parsedDate = parse(dateString, fmt, new Date());
        if (isValid(parsedDate)) {
            return parsedDate;
        }
    }
    return null;
}


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
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const [vendorPopoverOpen, setVendorPopoverOpen] = useState(false);
  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(formSchema),
  });

  const paymentMethod = form.watch('paymentMethod');
  const isEditing = !!expense;

  const [manualDate, setManualDate] = useState('');

  useEffect(() => {
    if (open) {
      if (isEditing && expense) {
        const expenseDate = new Date(expense.date);
        form.reset({
          date: expenseDate,
          category: expense.category,
          vendor: expense.vendorName,
          description: expense.description,
          amount: expense.amount,
          paymentMethod: expense.paymentMethod,
          paymentReference: expense.paymentReference,
          invoiceNumber: expense.invoiceNumber,
        });
        setManualDate(format(expenseDate, "PPP"));
      } else {
        const newDate = new Date();
        form.reset({
            date: newDate,
            description: '',
            paymentReference: '',
            invoiceNumber: '',
            category: undefined,
            vendor: undefined,
            paymentMethod: undefined,
            amount: 0,
        });
        setManualDate(format(newDate, "PPP"));
      }
    }
  }, [expense, isEditing, open, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'date' && value.date && isValid(new Date(value.date))) {
        setManualDate(format(new Date(value.date), 'PPP'));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  const onSubmit = (data: AddExpenseFormValues) => {
    if (!appState) return;
    
    const expenseToSave: Expense = {
      id: expense?.id || '',
      projectId,
      date: format(data.date, 'yyyy-MM-dd'),
      category: data.category || 'Uncategorized',
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
  const { budgetCategories, vendors, setBudgetCategories, setVendors } = appState;

  const uniqueBudgetCategories = useMemo(() => {
    const categoryNames = new Set(budgetCategories.map(c => c.name));
    return Array.from(categoryNames).sort();
  }, [budgetCategories]);

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
                   <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="relative">
                           <Input
                             value={manualDate}
                             onChange={(e) => setManualDate(e.target.value)}
                             onBlur={() => {
                                const parsedDate = tryParseDate(manualDate);
                                if (parsedDate) {
                                  field.onChange(parsedDate);
                                } else {
                                  setManualDate(field.value ? format(field.value, "PPP") : "");
                                }
                             }}
                             className="w-full pl-3 text-left font-normal"
                           />
                           <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                        </div>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            if (date) {
                                field.onChange(date);
                                setManualDate(format(date, "PPP"));
                            }
                            setDatePickerOpen(false);
                        }}
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
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? uniqueBudgetCategories.find(
                                (cat) => cat === field.value
                              )
                            : "Select a budget category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                        <CommandEmpty>
                             <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const newCategoryName = form.getValues('category');
                                    if(newCategoryName && !uniqueBudgetCategories.includes(newCategoryName)) {
                                        setBudgetCategories(prev => [...prev, {id: crypto.randomUUID(), name: newCategoryName}]);
                                        field.onChange(newCategoryName);
                                    }
                                    setCategoryPopoverOpen(false);
                                }}
                                >
                                Create "{form.getValues('category')}"
                            </Button>
                        </CommandEmpty>
                        <CommandGroup>
                          {uniqueBudgetCategories.map((category) => (
                            <CommandItem
                              value={category}
                              key={category}
                              onSelect={() => {
                                form.setValue("category", category)
                                setCategoryPopoverOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  category === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {category}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Vendor (Optional)</FormLabel>
                   <Popover open={vendorPopoverOpen} onOpenChange={setVendorPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? vendors.find(
                                (vendor) => vendor.name === field.value
                              )?.name
                            : "Select a vendor"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search vendor..." onValueChange={(value) => field.onChange(value)} />
                        <CommandList>
                        <CommandEmpty>
                             <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                    const newVendorName = form.getValues('vendor');
                                    if(newVendorName && !vendors.some(v => v.name === newVendorName)) {
                                        const newVendor: Vendor = {
                                            id: crypto.randomUUID(),
                                            name: newVendorName,
                                            trade: 'Uncategorized',
                                            contactPerson: 'N/A',
                                            phone: 'N/A',
                                            email: 'N/A'
                                        };
                                        setVendors(prev => [...prev, newVendor]);
                                        field.onChange(newVendorName);
                                    }
                                    setVendorPopoverOpen(false);
                                }}
                                >
                                Create "{form.getValues('vendor')}"
                            </Button>
                        </CommandEmpty>
                        <CommandGroup>
                          {vendors
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((vendor) => (
                            <CommandItem
                              value={vendor.name}
                              key={vendor.id}
                              onSelect={() => {
                                form.setValue("vendor", vendor.name)
                                setVendorPopoverOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  vendor.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {vendor.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                         </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                      <SelectItem value="Groundbreaking">Groundbreaking</SelectItem>
                      <SelectItem value="to be paid">To be paid</SelectItem>
                      <SelectItem value="Bank ACH">Bank ACH</SelectItem>
                      <SelectItem value="Karim's Card">Karim's Card</SelectItem>
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
