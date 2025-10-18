
'use client'
import { budgetItems, projects } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, use } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { AddBudgetItemDialog } from "./_components/add-budget-item-dialog";

export default function ProjectBudgetPage({ params: paramsProp }: { params: Promise<{ id: string }> }) {
    const params = use(paramsProp);
    const project = projects.find(p => p.id === params.id);
    if (!project) {
        notFound();
    }
    
    const [showGroupByCategory, setShowGroupByCategory] = useState(false);
    const [isAddBudgetItemOpen, setIsAddBudgetItemOpen] = useState(false);

    const projectBudgetItems = budgetItems.filter(item => item.projectId === project.id);
    
    return (
        <>
            <AddBudgetItemDialog open={isAddBudgetItemOpen} onOpenChange={setIsAddBudgetItemOpen} />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">Project Budget</CardTitle>
                            <CardDescription>Detailed cost breakdown for {project.name}.</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="group-by-category" checked={showGroupByCategory} onCheckedChange={setShowGroupByCategory}/>
                                <Label htmlFor="group-by-category">Group by Category</Label>
                            </div>
                            <Button onClick={() => setIsAddBudgetItemOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Budget Item
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Cost Type</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">Original Budget</TableHead>
                                <TableHead className="text-right">Approved COs</TableHead>
                                <TableHead className="text-right">Revised Budget</TableHead>
                                <TableHead className="text-right">Committed Cost</TableHead>
                                <TableHead className="text-right">Projected Cost</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projectBudgetItems.map((item, index) => {
                                 const revisedBudget = item.originalBudget + item.approvedCOBudget;

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.category}</TableCell>
                                        <TableCell>{item.costType}</TableCell>
                                        <TableCell>{}</TableCell>
                                        <TableCell className="text-right">${item.originalBudget.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${item.approvedCOBudget.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-semibold">${revisedBudget.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${item.committedCost.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${item.projectedCost.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
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
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
