

'use client';

import { useEffect, useState, useContext } from 'react';
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
import type { TeamMember } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { AppStateContext } from '@/context/app-state-context';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.'),
  avatar: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddEditTeamMemberDialog({
  open,
  onOpenChange,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
}) {
  const { toast } = useToast();
  const appState = useContext(AppStateContext);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const isEditing = !!member;

  useEffect(() => {
    if (open) {
      if (isEditing && member) {
        form.reset({
            name: member.name,
            role: member.role,
            email: member.email,
            phone: member.phone,
        });
        setAvatarPreview(member.avatarUrl);
      } else {
        form.reset({
          name: '',
          role: '',
          email: '',
          phone: '',
          avatar: undefined,
        });
        setAvatarPreview(null);
      }
    }
  }, [member, isEditing, open, form]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('avatar', event.target.files);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!appState) return;

    let avatarUrl = member?.avatarUrl || `https://i.pravatar.cc/150?u=${crypto.randomUUID()}`;
    if (data.avatar && data.avatar[0]) {
      const file = data.avatar[0] as File;
      avatarUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }

    const memberToSave: Omit<TeamMember, 'id'> = {
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      avatarUrl,
    };
    
    if (isEditing && member) {
        appState.setTeamMembers(prev => prev.map(m => m.id === member.id ? { ...member, ...memberToSave } : m));
    } else {
        appState.setTeamMembers(prev => [...prev, { id: crypto.randomUUID(), ...memberToSave }]);
    }

    toast({
      title: `Member ${isEditing ? 'Updated' : 'Created'}`,
      description: `Successfully ${isEditing ? 'updated' : 'created'} member: ${data.name}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'New'} Team Member</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this team member.' : 'Add a new member to your team.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                     <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            {avatarPreview ? (
                                <AvatarImage src={avatarPreview} alt="Avatar preview" />
                            ) : null}
                            <AvatarFallback>
                                <User className="h-10 w-10" />
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarChange}
                            className='w-full'
                            />
                            <p className='text-xs text-muted-foreground mt-1'>Upload a photo for the team member.</p>
                        </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Project Manager" {...field} />
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
                    <Input type="email" placeholder="e.g., john.d@company.com" {...field} />
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
                    <Input placeholder="e.g., 555-123-4567" {...field} />
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
