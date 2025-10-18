
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/lib/data";
import { Edit, MoreVertical, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddProjectDialog } from './_components/add-project-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function ProjectsPage() {
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const { toast } = useToast();

    const statusVariant = {
        'In Progress': 'default',
        'Planning': 'secondary',
        'Completed': 'outline',
    } as const;

    const handleAction = (action: 'Edit' | 'Delete', projectName: string) => {
        toast({
            title: `Action: ${action}`,
            description: `${action} action for project "${projectName}" was triggered.`,
            variant: action === 'Delete' ? 'destructive' : 'default',
        });
    };

    return (
        <>
            <AddProjectDialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                        <p className="text-muted-foreground">
                            Manage all your construction projects from start to finish.
                        </p>
                    </div>
                    <Button onClick={() => setIsAddProjectOpen(true)}>
                        <PlusCircle className="mr-2" />
                        New Project
                    </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map(project => (
                        <Card key={project.id} className="flex flex-col">
                            <CardHeader className="p-0">
                                <Link href={`/projects/${project.id}`}>
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.name}
                                            fill
                                            className="rounded-t-lg object-cover"
                                            data-ai-hint={project.imageHint}
                                        />
                                    </div>
                                </Link>
                            </CardHeader>
                            <CardContent className="flex-grow p-6">
                                <div className="flex items-start justify-between">
                                    <Link href={`/projects/${project.id}`}>
                                        <CardTitle className="mb-2 text-xl hover:underline">{project.name}</CardTitle>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleAction('Edit', project.name)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('Delete', project.name)} className="text-destructive">
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-2">
                                <div className="w-full">
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>Progress</span>
                                        <span>{project.percentComplete}%</span>
                                    </div>
                                    <Progress value={project.percentComplete} aria-label={`${project.percentComplete}% complete`} />
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    Contract: ${project.revisedContract.toLocaleString()}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
