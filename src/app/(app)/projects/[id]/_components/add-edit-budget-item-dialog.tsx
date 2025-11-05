'use client';

import { useEffect, useContext } from 'react';
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
  approvedCOBudget: z.coerce.number().min(0, 'CO Budget must be a positive number.'),
  committedCost: z.coerce.number().min(0, 'Committed Cost must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddEditBudgetItemDialog({
  open,
  onOpenChange,
  projectId,
  budgetItem,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  budgetItem: BudgetItem | null;
  onSave: (item: BudgetItem) => void;
}) {
  const { toast } = useToast();
  const appState = useContext(AppStateContext);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
        if (budgetItem) {
            form.reset({
                category: budgetItem.category,
                costType: budgetItem.costType,
                notes: budgetItem.notes || '',
                originalBudget: budgetItem.originalBudget,
                approvedCOBudget: budgetItem.approvedCOBudget,
                committedCost: budgetItem.committedCost,
            });
        } else {
            form.reset({
                notes: '',
                costType: 'material',
                originalBudget: 0,
                approvedCOBudget: 0,
                committedCost: 0,
                category: undefined,
            });
        }
    }
  }, [budgetItem, open, form]);

  const onSubmit = (data: FormValues) => {
    if (!appState) return;

    const itemToSave: BudgetItem = {
        id: budgetItem?.id || '',
        projectId,
        category: data.category,
        costType: data.costType,
        notes: data.notes,
        originalBudget: data.originalBudget,
        approvedCOBudget: data.approvedCOBudget,
        committedCost: data.committedCost,
        projectedCost: data.originalBudget + data.approvedCOBudget,
    };
    
    onSave(itemToSave);

    toast({
      title: `Budget Item ${budgetItem ? 'Updated' : 'Added'}`,
      description: `Successfully ${budgetItem ? 'updated' : 'added'} ${data.category} to the budget.`,
    });
    onOpenChange(false);
  };

  if (!appState) return null;
  const isEditing = !!budgetItem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Budget Item</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this budget item.' : 'Add a new line item to your project budget.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
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
                    value={field.value}
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
             <FormField
              control={form.control}
              name="approvedCOBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approved CO Budget</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="committedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Committed Cost</FormLabel>
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}