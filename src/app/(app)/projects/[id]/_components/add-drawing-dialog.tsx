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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  drawingFile: z.any().refine((files) => files?.length == 1, 'Drawing file is required.'),
  sheetNumber: z.string().min(1, 'Sheet number is required.'),
  drawingTitle: z.string().min(1, 'Drawing title is required.'),
  versionDescription: z.string().optional(),
});

type AddDrawingFormValues = z.infer<typeof formSchema>;

export function AddDrawingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const form = useForm<AddDrawingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      versionDescription: '',
    },
  });

  const onSubmit = (data: AddDrawingFormValues) => {
    console.log('New drawing:', data);
    toast({
      title: 'Drawing Uploaded',
      description: `Successfully uploaded sheet ${data.sheetNumber}.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Drawing</DialogTitle>
          <DialogDescription>
            Fill out the form below to upload a new drawing to the project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="drawingFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drawing File</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed bg-secondary">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className='flex-1'>
                             <Input 
                                type="file" 
                                accept="application/pdf,image/*" 
                                onChange={(e) => field.onChange(e.target.files)}
                                className='w-full'
                             />
                             <p className='text-xs text-muted-foreground mt-1'>Select a PDF or image file. The system will attempt to name it.</p>
                        </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sheetNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sheet Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A-101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="drawingTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drawing Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., First Floor Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="versionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Issued for Construction"
                      {...field}
                    />
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
              <Button type="submit">Upload Drawing</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
