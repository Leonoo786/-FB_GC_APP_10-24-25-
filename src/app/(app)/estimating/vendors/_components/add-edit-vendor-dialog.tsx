

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
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { Vendor } from '@/lib/types';
import { AppStateContext } from '@/context/app-state-context';

const formSchema = z.object({
  name: z.string().min(1, 'Vendor name is required.'),
  trade: z.string().min(1, 'Trade is required.'),
  contactPerson: z.string().min(1, 'Contact person is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
  email: z.string().email('Invalid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddEditVendorDialog({
  open,
  onOpenChange,
  vendor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
}) {
  const { toast } = useToast();
  const appState = useContext(AppStateContext);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (vendor) {
      form.reset(vendor);
    } else {
      form.reset({
        name: '',
        trade: '',
        contactPerson: '',
        phone: '',
        email: '',
      });
    }
  }, [vendor, form, open]);

  const onSubmit = (data: FormValues) => {
    if (!appState) return;
    const { setVendors } = appState;
    const isEditing = !!vendor;

    if (isEditing) {
        setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, ...data } : v));
    } else {
        setVendors(prev => [...prev, { id: crypto.randomUUID(), ...data }]);
    }

    toast({
      title: `Vendor ${vendor ? 'Updated' : 'Created'}`,
      description: `Successfully ${vendor ? 'updated' : 'created'} vendor: ${data.name}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit' : 'New'} Vendor</DialogTitle>
          <DialogDescription>
            {vendor ? 'Update the details for this vendor.' : 'Create a new vendor or subcontractor.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A-1 Electric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="trade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Electrical" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sarah Connor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 555-0101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., sarah.c@a1electric.com" {...field} />
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
      