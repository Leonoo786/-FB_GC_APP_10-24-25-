

'use client'; 

import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { ProjectTabs } from "./_components/project-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React, { useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AppStateContext } from "@/context/app-state-context";
import { differenceInDays, format, parseISO } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProjectSummaryChart } from "./_components/project-summary-chart";
import { AddEditProjectDialog } from "../_components/add-project-dialog";
import { useUser } from "@/firebase";

export function ProjectDetailLayout({
    projectId,
    children,
}: {
    projectId: string;
    children: React.ReactNode;
}) {
    const { toast } = useToast();
    const router = useRouter();
    const appState = useContext(AppStateContext);
    const { user } = useUser();
    const [hasMounted, setHasMounted] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!appState || !hasMounted) {
        // This can be a loading spinner
        return <div>Loading...</div>;
    }

    const { projects, deleteProject, budgetItems, expenses } = appState;
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        // This is a temporary state while data loads, return loading or skeleton
        // a full notFound() could flash unnecessarily
        return <div>Loading project details...</div>;
    }

    const projectBudgetItems = budgetItems.filter(item => item.projectId === project.id);
    const projectExpenses = expenses.filter(expense => expense.projectId === project.id);

    const totalBudget = projectBudgetItems.reduce((acc, item) => acc + item.originalBudget + item.approvedCOBudget, 0);
    const spentToDate = projectExpenses.reduce((acc, item) => acc + item.amount, 0);
    const budgetProgress = totalBudget > 0 ? Math.min(Math.max((spentToDate / totalBudget) * 100, 0), 100) : 0;
    
    const startDate = parseISO(project.startDate);
    const endDate = parseISO(project.endDate);
    const today = new Date();

    const totalDays = differenceInDays(endDate, startDate);
    const daysPassed = differenceInDays(today, startDate);
    const daysRemaining = differenceInDays(endDate, today);
    const timeProgress = totalDays > 0 ? Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100) : 0;
    
    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    const handleDelete = async () => {
        await deleteProject(project.id);
        toast({
            title: "Project Deleted",
            description: `The "${project.name}" project has been deleted.`,
            variant: "destructive"
        });
        router.push('/projects');
    };
    
    const budgetChartData = [
        { name: "Spent", value: spentToDate, fill: "hsl(var(--primary))" },
        { name: "Remaining", value: Math.max(0, totalBudget - spentToDate), fill: "hsl(var(--muted))" },
    ];


    return (
        <>
            <AddEditProjectDialog 
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                project={project}
            />
            <div className="flex flex-col gap-6">
                <div>
                     <Button variant="ghost" asChild className="mb-4">
                        <Link href="/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Link>
                    </Button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {project.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {project.projectNumber}
                            </p>
                        </div>
                         <div className="flex gap-4 items-center">
                            <ProjectSummaryChart 
                                data={budgetChartData}
                                label="Budget"
                                metric={`$${spentToDate.toLocaleString()}`}
                                metricLabel={`${budgetProgress.toFixed(1)}% of $${totalBudget.toLocaleString()}`}
                            />
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                     <DropdownMenuItem onClick={handleEdit}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Project
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                                <Trash className="mr-2 h-4 w-4" />
                                                Delete Project
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
                                                onClick={handleDelete}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                </div>

                <Card>
                    <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <p className="text-sm text-muted-foreground">Total Budget (cost)</p>
                            <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Internal cost estimate</p>
                        </div>
                         <div className="lg:col-span-1">
                            <p className="text-sm text-muted-foreground">Spent to Date</p>
                            <p className="text-2xl font-bold">${spentToDate.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{budgetProgress.toFixed(1)}% of Budget</p>
                        </div>
                        <div className="space-y-4 lg:col-span-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {totalDays} Total Days ({format(endDate, 'MMM d, yyyy')})
                                </p>
                                <Progress value={timeProgress} className="h-2 mt-1" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{daysPassed > 0 ? `${daysPassed} days passed` : 'Starting soon'}</span>
                                <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Completed'}</span>
                                </div>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">
                                    Budget Status
                                </p>
                                <Progress value={budgetProgress} className="h-2 mt-1" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>${spentToDate.toLocaleString()} spent</span>
                                <span>${(totalBudget - spentToDate).toLocaleString()} left</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <ProjectTabs projectId={project.id} />
                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </>
    );
}
