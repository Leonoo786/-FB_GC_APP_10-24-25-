
'use client';

import { useEffect, useContext, useState } from 'react';
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
import type { Task, Project, TeamMember } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { AppStateContext } from '@/context/app-state-context';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const formSchema = z.object({
  title: z.string().min(1, 'Task title is required.'),
  projectId: z.string({ required_error: 'Please select a project.' }),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  assigneeId: z.string().optional(),
  dueDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddTaskDialog({
  open,
  onOpenChange,
  onSave,
  task,
  projects,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
  task: Task | null;
  projects: Project[];
  teamMembers: TeamMember[];
}) {
  const { toast } = useToast();
  const isEditing = !!task;
  const appState = useContext(AppStateContext);
  const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false);
  const { teamMembers, setTeamMembers } = appState || {};


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      if (isEditing && task) {
        form.reset({
          title: task.title,
          projectId: task.projectId,
          status: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId || undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        });
      } else {
        form.reset({
            status: 'To Do',
            priority: 'Medium',
            title: '',
            projectId: undefined,
            assigneeId: undefined,
            dueDate: undefined,
        });
      }
    }
  }, [open, form, isEditing, task]);

  const onSubmit = (data: FormValues) => {
    const taskToSave: Task = {
      id: task?.id || '', // will be set in parent if new
      title: data.title,
      projectId: data.projectId,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId || '',
      dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
    };
    onSave(taskToSave);
    onOpenChange(false);
  };
  
  if (!appState) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add New'} Task</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of this task.' : 'Fill out the form to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finalize material order" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Assign To (Optional)</FormLabel>
                      <Popover open={assigneePopoverOpen} onOpenChange={setAssigneePopoverOpen}>
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
                                ? teamMembers.find(
                                    (member) => member.id === field.value
                                  )?.name
                                : "Select a team member"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search team member..." />
                            <CommandList>
                              <CommandEmpty>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onMouseDown={(e) => {
                                      e.preventDefault();
                                      const newMemberName = form.getValues('assigneeId'); // a bit of a hack, it holds the search query
                                      if(newMemberName && teamMembers && setTeamMembers && !teamMembers.some(m => m.name.toLowerCase() === newMemberName.toLowerCase())) {
                                          const newMember: TeamMember = {
                                              id: crypto.randomUUID(),
                                              name: newMemberName,
                                              role: 'New Member',
                                              email: 'tbd@email.com',
                                              phone: 'N/A',
                                              avatarUrl: `https://i.pravatar.cc/150?u=${crypto.randomUUID()}`
                                          };
                                          setTeamMembers(prev => [...prev, newMember]);
                                          field.onChange(newMember.id);
                                          toast({ title: "Team Member Added", description: `Added "${newMemberName}" to the team.` });
                                      }
                                      setAssigneePopoverOpen(false);
                                  }}
                                  >
                                  Create "{form.getValues('assigneeId')}"
                                </Button>
                              </CommandEmpty>
                              <CommandGroup>
                                {teamMembers?.map((member) => (
                                  <CommandItem
                                    value={member.name}
                                    key={member.id}
                                    onSelect={() => {
                                      form.setValue("assigneeId", member.id)
                                      setAssigneePopoverOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        member.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {member.name}
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
                name="dueDate"
                render={({ field }) => (
                    <FormItem className='flex flex-col'>
                    <FormLabel>Due Date (Optional)</FormLabel>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
