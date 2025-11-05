'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import type { Task, Project } from '@/lib/types';
import Link from 'next/link';
import { addDays, startOfDay } from 'date-fns';

type TasksDueTodayProps = {
    tasks: Task[];
    projects: Project[];
    onAddTask: () => void;
    onViewTask: (task: Task) => void;
};

export function TasksDueToday({ tasks, projects, onAddTask, onViewTask }: TasksDueTodayProps) {
    const tasksDueSoon = tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        const today = startOfDay(new Date());
        const inAWeek = addDays(today, 7);
        return dueDate >= today && dueDate <= inAWeek && t.status !== 'Done';
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tasks Due in Next 7 Days</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/tasks">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {tasksDueSoon.length > 0 ? (
                    <ul className="space-y-4">
                        {tasksDueSoon.map(task => (
                             <li key={task.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{task.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'}
                                    </p>
                                </div>
                                <Button variant="secondary" size="sm" onClick={() => onViewTask(task)}>View</Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <CheckCircle className="mx-auto h-8 w-8 mb-2" />
                        <p>No tasks due in the next 7 days</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={onAddTask}>
                            Add New Task
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}