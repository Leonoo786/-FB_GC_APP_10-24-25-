
'use client';

import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notFound } from 'next/navigation';
import { AddScheduleItemDialog } from '../../_components/add-schedule-item-dialog';
import { format } from 'date-fns';
import type { Task } from '@/lib/types';
import { AppStateContext } from '@/context/app-state-context';


export default function ProjectSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const appState = useContext(AppStateContext);
  
  if (!appState) {
    return <div>Loading...</div>;
  }

  const { projects, tasks, teamMembers } = appState;
  
  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    notFound();
  }

  const projectTasks = tasks.filter((t) => t.projectId === params.id);
  
  const statusVariant: Record<Task['status'], 'default' | 'secondary' | 'outline'> = {
    'In Progress': 'default',
    'To Do': 'secondary',
    'Done': 'outline',
  };

  return (
    <>
      <AddScheduleItemDialog
        open={isAddItemOpen}
        onOpenChange={setIsAddItemOpen}
      />
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <div>
              <CardTitle class="text-2xl">Project Schedule</CardTitle>
              <CardDescription>
                View and manage the project timeline and tasks.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddItemOpen(true)}>
              <PlusCircle class="mr-2 h-4 w-4" /> Add Schedule Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead class="text-right">Due Date</TableHead>
                <TableHead class="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell class="font-medium">{task.title}</TableCell>
                  <TableCell>{teamMembers.find(m => m.id === task.assigneeId)?.name || 'Unassigned'}</TableCell>
                  <TableCell>
                     <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell class="text-right">{format(new Date(task.dueDate), 'PP')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal class="h-4 w-4" />
                          <span class="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {projectTasks.length === 0 && (
              <div class="text-center py-12 text-muted-foreground">
                <CalendarIcon class="mx-auto h-12 w-12" />
                <h3 class="mt-2 text-sm font-semibold">No schedule items yet</h3>
                <p class="mt-1 text-sm">Get started by adding a new schedule item.</p>
                 <Button class="mt-6" onClick={() => setIsAddItemOpen(true)}>
                  <PlusCircle class="mr-2 h-4 w-4" /> Add Schedule Item
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </>
  );
}
