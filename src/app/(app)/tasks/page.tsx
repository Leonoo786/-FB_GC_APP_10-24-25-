
'use client';

import { useContext, useMemo, useState } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Task } from '@/lib/types';
import { format } from 'date-fns';
import { AddTaskDialog } from './_components/add-task-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type TaskStatus = 'To Do' | 'In Progress' | 'Done';
const STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

const priorityVariant: Record<Task['priority'], 'destructive' | 'secondary' | 'outline'> = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
};

export default function TasksPage() {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const appState = useContext(AppStateContext);
    const { toast } = useToast();

    if (!appState) {
        return <div>Loading...</div>;
    }

    const { tasks, teamMembers, projects, setTasks } = appState;

    const tasksByStatus = useMemo(() => {
        const grouped: Record<TaskStatus, Task[]> = {
            'To Do': [],
            'In Progress': [],
            'Done': [],
        };
        tasks.forEach(task => {
            if (grouped[task.status]) {
                grouped[task.status].push(task);
            }
        });
        return grouped;
    }, [tasks]);

    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('');
    };

    const handleNewTask = () => {
        setSelectedTask(null);
        setIsAddTaskOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsAddTaskOpen(true);
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(current => current.filter(t => t.id !== taskId));
        toast({
            title: "Task Deleted",
            description: "The task has been successfully deleted.",
            variant: "destructive",
        });
    };
    
    const handleSaveTask = (task: Task) => {
        if (task.id) { // Editing existing task
            setTasks(current => current.map(t => t.id === task.id ? task : t));
        } else { // Adding new task
            setTasks(current => [{...task, id: crypto.randomUUID()}, ...current]);
        }
    };

    return (
        <>
            <AddTaskDialog
                open={isAddTaskOpen}
                onOpenChange={setIsAddTaskOpen}
                onSave={handleSaveTask}
                task={selectedTask}
                projects={projects}
                teamMembers={teamMembers}
            />
            <div class="space-y-6">
                 <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold tracking-tight">Task Board</h1>
                        <p class="text-muted-foreground">
                            Manage project tasks with a Kanban board.
                        </p>
                    </div>
                    <Button onClick={handleNewTask}>
                        <PlusCircle class="mr-2" />
                        Add Task
                    </Button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {STATUSES.map(status => (
                        <Card key={status} class="bg-secondary/50">
                            <CardHeader>
                                <CardTitle class="text-lg">{status} ({tasksByStatus[status].length})</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                {tasksByStatus[status].map(task => {
                                    const assignee = teamMembers.find(m => m.id === task.assigneeId);
                                    return (
                                        <Card key={task.id}>
                                            <CardContent class="p-4 space-y-3">
                                                <div class="flex justify-between items-start">
                                                    <h4 class="font-semibold leading-tight">{task.title}</h4>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" class="h-6 w-6">
                                                                <MoreHorizontal class="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit</DropdownMenuItem>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} class="text-destructive">Delete</DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently delete the task "{task.title}".
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDeleteTask(task.id)} class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <div class="flex items-center gap-2">
                                                        {assignee && (
                                                            <Avatar class="h-6 w-6">
                                                                <AvatarImage src={assignee.avatarUrl} />
                                                                <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                                                    </div>
                                                    <span class="text-xs text-muted-foreground">
                                                        {task.dueDate ? format(new Date(task.dueDate), 'M/dd/yyyy') : ''}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                                 {tasksByStatus[status].length === 0 && (
                                    <div class="text-center text-sm text-muted-foreground py-8">
                                        No tasks in this column.
                                    </div>
                                 )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
