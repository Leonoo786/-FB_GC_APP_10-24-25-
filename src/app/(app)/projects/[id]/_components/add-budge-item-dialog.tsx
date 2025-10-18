
'use client';

import { useContext } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { AppStateContext } from '@/context/app-state-context';
import type { BudgetItem } from '@/lib/types';

const formSchema = z.object({
  category: z.string({ required_error: 'Please select a category.' }),
  costType: z.enum(['labor', 'material', 'both']),
  notes: z.string().optional(),
  originalBudget: z.coerce.number().min(0, 'Budget must be a positive number.'),
});

type AddBudgetItemFormValues = z.infer<typeof formSchema>;

export function AddBudgetItemDialog({
  open,
  onOpenChange,
  projectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}) {
  const { toast } = useToast();
  const appState = useContext(AppStateContext);
  const form = useForm<AddBudgetItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
      costType: 'material',
    },
  });

  const onSubmit = (data: AddBudgetItemFormValues) => {
    if (!appState) return;

    const newBudgetItem: BudgetItem = {
      id: crypto.randomUUID(),
      projectId,
      category: data.category,
      costType: data.costType,
      originalBudget: data.originalBudget,
      notes: data.notes,
      approvedCOBudget: 0,
      committedCost: 0,
      projectedCost: data.originalBudget,
    };
    
    appState.setBudgetItems(current => [...current, newBudgetItem]);

    toast({
      title: 'Budget Item Added',
      description: `Successfully added ${data.category} to the budget.`,
    });
    onOpenChange(false);
    form.reset();
  };

  if (!appState) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Budget Item</DialogTitle>
          <DialogDescription>
            Add a new line item to your project budget.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a budget category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appState.budgetCategories
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
              name="costType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cost type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any relevant notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originalBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Budget</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
