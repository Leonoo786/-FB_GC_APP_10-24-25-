

'use client';

import { useState, useContext, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit, MoreVertical, PlusCircle, Trash, Calendar, DollarSign, PiggyBank, Target, TrendingUp, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddEditProjectDialog } from './_components/add-project-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AppStateContext } from '@/context/app-state-context';
import type { Project } from '@/lib/types';
import { differenceInDays, parseISO } from 'date-fns';


export default function ProjectsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const appState = useContext(AppStateContext);
    const { toast } = useToast();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const projectData = useMemo(() => {
        if (!appState) return [];
        const { projects, budgetItems, expenses } = appState;
        
        return projects.map(project => {
            const projectBudgetItems = budgetItems.filter(item => item.projectId === project.id);
            const projectExpenses = expenses.filter(expense => expense.projectId === project.id);
            
            const totalBudget = projectBudgetItems.reduce((acc, item) => acc + item.originalBudget + item.approvedCOBudget, 0);
            const spentSoFar = projectExpenses.reduce((acc, item) => acc + item.amount, 0);
            const remainingBudget = totalBudget - spentSoFar;
            const profitLoss = (project.finalBidAmount || 0) - spentSoFar;
            const budgetUsedPercent = totalBudget > 0 ? Math.min((spentSoFar / totalBudget) * 100, 100) : 0;
            
            const now = new Date();
            const startDate = parseISO(project.startDate);
            const endDate = parseISO(project.endDate);
            const daysIn = differenceInDays(now, startDate);
            const daysLeft = differenceInDays(endDate, now);
            
            return {
                ...project,
                totalBudget,
                spentSoFar,
                remainingBudget,
                profitLoss,
                budgetUsedPercent,
                daysIn: daysIn > 0 ? daysIn : 0,
                daysLeft: daysLeft > 0 ? daysLeft : 0,
            };
        });

    }, [appState]);

    if (!appState || !hasMounted) {
        return <div>Loading...</div>; // Or some other loading state/skeleton
    }
    
    const { setProjects } = appState;

    const statusVariant = {
        'In Progress': 'default',
        'Planning': 'secondary',
        'Completed': 'outline',
    } as const;
    
    const handleNewProject = () => {
        setSelectedProject(null);
        setDialogOpen(true);
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setDialogOpen(true);
    };
    
    const handleDelete = (projectId: string, projectName: string) => {
        setProjects(current => current.filter(p => p.id !== projectId));
        toast({
            title: "Project Deleted",
            description: `Project "${projectName}" has been removed.`,
            variant: "destructive",
        });
    };

    return (
        <>
            <AddEditProjectDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                project={selectedProject}
            />
            <div class="flex flex-col gap-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold tracking-tight">Projects</h1>
                        <p class="text-muted-foreground">
                            Manage all your construction projects from start to finish.
                        </p>
                    </div>
                    <Button onClick={handleNewProject}>
                        <PlusCircle class="mr-2" />
                        New Project
                    </Button>
                </div>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projectData.map(project => (
                        <Card key={project.id} class="flex flex-col">
                            <CardHeader class="p-0">
                                <Link href={`/projects/${project.id}`}>
                                    <div class="relative h-48 w-full">
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.name}
                                            fill
                                            class="rounded-t-lg object-cover"
                                            data-ai-hint={project.imageHint}
                                        />
                                    </div>
                                </Link>
                            </CardHeader>
                            <CardContent class="flex-grow p-6">
                                <div class="flex items-start justify-between">
                                    <Link href={`/projects/${project.id}`}>
                                        <CardTitle class="mb-2 text-xl hover:underline">{project.name}</CardTitle>
                                    </Link>
                                    <div class="flex items-center gap-1">
                                        <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" class="h-8 w-8">
                                                    <MoreVertical class="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(project)}>
                                                    <Edit class="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} class="text-destructive">
                                                            <Trash class="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the project
                                                                &quot;{project.name}&quot;.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(project.id, project.name)}
                                                                class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <CardDescription class="line-clamp-2">{project.description}</CardDescription>
                            </CardContent>
                            <CardFooter class="flex flex-col items-start gap-4">
                                <div class="w-full">
                                    <div class="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>Budget Status</span>
                                        <span>{project.budgetUsedPercent.toFixed(1)}% Used</span>
                                    </div>
                                    <Progress value={project.budgetUsedPercent} aria-label={`${project.budgetUsedPercent}% of budget used`} />
                                </div>
                                <div class="w-full space-y-2 text-sm text-muted-foreground">
                                     <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-1.5">
                                            <DollarSign class="size-4" />
                                            <span>Final Bid:</span>
                                        </div>
                                        <span class="font-medium text-foreground">${(project.finalBidAmount || 0).toLocaleString()}</span>
                                    </div>
                                     <div class="flex items-center justify-between gap-2">
                                         <div class="flex items-center gap-1.5">
                                            <Target class="size-4" />
                                            <span>Total Budget (cost):</span>
                                        </div>
                                        <span class="font-medium text-foreground">${project.totalBudget.toLocaleString()}</span>
                                    </div>
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-1.5">
                                            <TrendingUp class="size-4" />
                                            <span>Spent to Date:</span>
                                        </div>
                                        <span class="font-medium text-foreground">${project.spentSoFar.toLocaleString()}</span>
                                    </div>
                                    <div class="flex items-center justify-between gap-2">
                                         <div class="flex items-center gap-1.5">
                                            <Wallet class="size-4" />
                                            <span>Remaining Budget:</span>
                                        </div>
                                        <span class="font-medium text-foreground">${project.remainingBudget.toLocaleString()}</span>
                                    </div>
                                     <div class="flex items-center justify-between gap-2">
                                         <div class="flex items-center gap-1.5">
                                            <PiggyBank class="size-4" />
                                            <span>Profit / Loss:</span>
                                        </div>
                                        <span class="font-medium text-foreground">${project.profitLoss.toLocaleString()}</span>
                                    </div>
                                    <div class="flex items-center justify-between gap-2 pt-1 border-t mt-2">
                                         <div class="flex items-center gap-1.5">
                                            <Calendar class="size-4" />
                                            <span>Timeline:</span>
                                        </div>
                                        <span class="font-medium text-foreground">{project.daysIn} days in, {project.daysLeft} days left</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
