
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import type { Task, Project } from '@/lib/types';
import Link from 'next/link';

type TasksDueTodayProps = {
    tasks: Task[];
    projects: Project[];
};

export function TasksDueToday({ tasks, projects }: TasksDueTodayProps) {
    const tasksDueToday = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'Done');

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tasks Due Today</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/tasks">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {tasksDueToday.length > 0 ? (
                    <ul className="space-y-4">
                        {tasksDueToday.map(task => (
                             <li key={task.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{task.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'}
                                    </p>
                                </div>
                                <Button variant="secondary" size="sm">View</Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <CheckCircle className="mx-auto h-8 w-8 mb-2" />
                        <p>No tasks due today</p>
                        <Button variant="outline" size="sm" className="mt-4">
                            Add New Task
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

