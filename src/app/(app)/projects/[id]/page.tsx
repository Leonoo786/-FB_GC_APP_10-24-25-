
'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, use, useContext, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Upload } from "lucide-react";
import { AddBudgetItemDialog } from "./_components/add-budget-item-dialog";
import { AppStateContext } from "@/context/app-state-context";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import type { BudgetItem } from "@/lib/types";

export default function ProjectBudgetPage({ params: paramsProp }: { params: Promise<{ id: string }> }) {
    const params = use(paramsProp);
    const appState = useContext(AppStateContext);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const project = appState?.projects.find(p => p.id === params.id);
    
    if (!appState || !project) {
        // Let layout handle the notFound case if context is not ready or project not found
        return null;
    }
    
    const [showGroupByCategory, setShowGroupByCategory] = useState(false);
    const [isAddBudgetItemOpen, setIsAddBudgetItemOpen] = useState(false);

    const projectBudgetItems = appState.budgetItems.filter(item => item.projectId === project.id);
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && appState) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet);

                    const newBudgetItems: BudgetItem[] = json.map((row: any) => ({
                        id: crypto.randomUUID(),
                        projectId: project.id,
                        category: row['Category'] || 'Uncategorized',
                        costType: ['labor', 'material', 'both'].includes(row['Cost Type']) ? row['Cost Type'] : 'material',
                        notes: row['Notes'] || '',
                        originalBudget: Number(row['Original Budget']) || 0,
                        approvedCOBudget: 0,
                        committedCost: 0,
                        projectedCost: Number(row['Original Budget']) || 0,
                    }));
                    
                    appState.setBudgetItems(current => [...current, ...newBudgetItems]);

                    toast({
                        title: "Import Successful",
                        description: `${newBudgetItems.length} budget items have been imported.`,
                    });
                } catch (error) {
                    console.error("Error importing budget:", error);
                    toast({
                        title: "Import Failed",
                        description: "There was an error processing the file. Please ensure it is a valid Excel or CSV file with the correct columns (Category, Cost Type, Notes, Original Budget).",
                        variant: "destructive",
                    });
                }
            };
            reader.readAsBinaryString(file);
        }
        // Reset file input
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <AddBudgetItemDialog open={isAddBudgetItemOpen} onOpenChange={setIsAddBudgetItemOpen} projectId={project.id} />
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
                             <Button variant="outline" onClick={handleImportClick}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import
                            </Button>
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
                                        <TableCell>{item.notes}</TableCell>
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
