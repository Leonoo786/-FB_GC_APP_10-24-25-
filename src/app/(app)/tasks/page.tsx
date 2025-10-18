
'use client';

import { useContext, useMemo } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Task } from '@/lib/types';
import { format } from 'date-fns';

type TaskStatus = 'To Do' | 'In Progress' | 'Done';
const STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

const priorityVariant: Record<Task['priority'], 'destructive' | 'secondary' | 'outline'> = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
};

export default function TasksPage() {
    const appState = useContext(AppStateContext);

    if (!appState) {
        return <div>Loading...</div>;
    }

    const { tasks, teamMembers } = appState;

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
        return name.split(' ').map(n => n[0]).join('');
    };

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
                    <p className="text-muted-foreground">
                        Manage project tasks with a Kanban board.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Task
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {STATUSES.map(status => (
                    <Card key={status} className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg">{status} ({tasksByStatus[status].length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tasksByStatus[status].map(task => {
                                const assignee = teamMembers.find(m => m.id === task.assigneeId);
                                return (
                                    <Card key={task.id}>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold leading-tight">{task.title}</h4>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    {assignee && (
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={assignee.avatarUrl} />
                                                            <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(task.dueDate), 'M/dd/yyyy')}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                             {tasksByStatus[status].length === 0 && (
                                <div className="text-center text-sm text-muted-foreground py-8">
                                    No tasks in this column.
                                </div>
                             )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
