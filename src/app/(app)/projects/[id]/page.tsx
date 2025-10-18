
'use client'
import { budgetItems, projects } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ProjectBudgetPage({ params }: { params: { id: string } }) {
    const project = projects.find(p => p.id === params.id);
    if (!project) {
        notFound();
    }
    
    const [showGroupByCategory, setShowGroupByCategory] = useState(false);

    const projectBudgetItems = budgetItems.filter(item => item.projectId === project.id);
    
    const getColor = (index: number) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-500'];
        return colors[index % colors.length];
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Top Spending Categories</CardTitle>
                        <CardDescription>A summary of spending by budget category for this project.</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="group-by-category" checked={showGroupByCategory} onCheckedChange={setShowGroupByCategory}/>
                        <Label htmlFor="group-by-category">Group by Category</Label>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Budget</TableHead>
                            <TableHead className="text-right">Spent</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                            <TableHead className="w-[150px]">Progress Chart</TableHead>
                            <TableHead className="text-center">Transactions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projectBudgetItems.map((item, index) => {
                             const totalBudget = item.originalBudget + item.approvedCOBudget;
                             const balance = totalBudget - item.committedCost;
                             const progress = totalBudget > 0 ? (item.committedCost / totalBudget) * 100 : 0;
                             const transactionCount = item.committedCost > 0 ? 1 : 0; // Mocked data

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <span className={cn("h-2.5 w-2.5 rounded-full", getColor(index))} />
                                            <span className="font-medium">{item.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">${totalBudget.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-red-600">${item.committedCost.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${balance.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={progress} className="h-2" />
                                            <span className="text-xs text-muted-foreground">{progress.toFixed(1)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" size="sm">
                                            {transactionCount} {transactionCount === 1 ? 'item' : 'items'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
