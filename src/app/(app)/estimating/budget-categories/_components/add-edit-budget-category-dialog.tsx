
'use client';

import { useEffect } from 'react';
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
import type { BudgetCategory } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddEditBudgetCategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: BudgetCategory | null;
  onSave: (category: BudgetCategory) => void;
}) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (category) {
      form.reset({ name: category.name });
    } else {
      form.reset({ name: '' });
    }
  }, [category, form, open]);

  const onSubmit = (data: FormValues) => {
    const categoryToSave: BudgetCategory = {
      id: category?.id || '',
      name: data.name,
    };
    onSave(categoryToSave);
    toast({
      title: `Category ${category ? 'Updated' : 'Created'}`,
      description: `Successfully ${category ? 'updated' : 'created'} category: ${data.name}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit' : 'New'} Budget Category</DialogTitle>
          <DialogDescription>
            {category ? 'Update the name of this budget category.' : 'Create a new budget category.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Demolition" {...field} />
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
