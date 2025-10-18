import { budgetItems, projects, teamMembers } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import { ProjectTabs } from "./_components/project-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ProjectDetailLayout({
    params,
    children,
}: {
    params: { id: string };
    children: React.ReactNode;
}) {
    const project = projects.find(p => p.id === params.id);
    if (!project) {
        notFound();
    }

    const projectManager = teamMembers.find(tm => tm.role === 'Project Manager');

    const projectBudgetItems = budgetItems.filter(item => item.projectId === project.id);
    const totalBudget = projectBudgetItems.reduce((acc, item) => acc + item.originalBudget + item.approvedCOBudget, 0);
    const spentToDate = projectBudgetItems.reduce((acc, item) => acc + item.committedCost, 0);
    const remaining = totalBudget - spentToDate;
    const budgetUsedPercent = totalBudget > 0 ? (spentToDate / totalBudget) * 100 : 0;

    return (
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
                     <div className="flex gap-2">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Category-based budgeting</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Spent to Date</p>
                        <p className="text-2xl font-bold">${spentToDate.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{budgetUsedPercent.toFixed(2)}% of budget</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className="text-2xl font-bold">${remaining.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">On Track</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Budget Status</p>
                        <Progress value={budgetUsedPercent} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">{budgetUsedPercent.toFixed(2)}% Used</p>
                    </div>
                </CardContent>
            </Card>

            <div>
                <ProjectTabs projectId={project.id} />
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
