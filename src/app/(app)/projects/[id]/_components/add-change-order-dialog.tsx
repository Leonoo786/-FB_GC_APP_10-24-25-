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
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vendors } from '@/lib/data';

const formSchema = z.object({
  coNumber: z.string().min(1, 'Change Order number is required.'),
  dateInitiated: z.date({ required_error: 'Please select a date.' }),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  status: z.enum(['Submitted', 'Approved', 'Executed', 'Rejected']),
  amount: z.coerce.number(),
  reason: z.string().optional(),
  vendorId: z.string().optional(),
  scheduleImpact: z.string().optional(),
});

type AddChangeOrderFormValues = z.infer<typeof formSchema>;

export function AddChangeOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const form = useForm<AddChangeOrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Submitted',
    },
  });

  const onSubmit = (data: AddChangeOrderFormValues) => {
    console.log('New change order:', data);
    toast({
      title: 'Change Order Added',
      description: `Successfully added Change Order ${data.coNumber}.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Change Order</DialogTitle>
          <DialogDescription>
            Create a new change order for this project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} class="space-y-4 max-h-[70vh] overflow-y-auto pr-6 pl-1">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change Order #</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CO-003" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dateInitiated"
                render={({ field }) => (
                  <FormItem class="flex flex-col">
                    <FormLabel>Date Initiated</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            class={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide a detailed description of the change." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Executed">Executed</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
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
            </div>
            
            <FormField
                control={form.control}
                name="vendorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vendor associated with this change" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {vendors.sort((a,b) => a.name.localeCompare(b.name)).map(vendor => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                                {vendor.name} ({vendor.trade})
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Explain why this change is necessary (e.g., owner request, unforeseen condition)." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
             <FormField
                control={form.control}
                name="scheduleImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Impact (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Adds 5 days to schedule" {...field} />
                    </FormControl>
                    <FormDescription>Describe the impact this change will have on the project schedule.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <DialogFooter class="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Change Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
