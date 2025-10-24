

'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState, use, useContext, useRef, useMemo } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Upload, Trash2 } from "lucide-react";
import { AddEditBudgetItemDialog } from "./_components/add-edit-budget-item-dialog";
import { AppStateContext } from "@/context/app-state-context";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import type { BudgetItem } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { TransactionsDialog } from "./_components/transactions-dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProjectBudgetPage({ params: paramsProp }: { params: Promise<{ id: string }> }) {
    const params = use(paramsProp);
    const appState = useContext(AppStateContext);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [transactionsDialogOpen, setTransactionsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBudgetItem, setSelectedBudgetItem] = useState<BudgetItem | null>(null);
    const [showGroupByCategory, setShowGroupByCategory] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    const project = appState?.projects.find(p => p.id === params.id);
    
    if (!appState || !project) {
        return null;
    }
    
    const { budgetItems, setBudgetItems, expenses } = appState;
    
    const projectBudgetItems = useMemo(() => 
        budgetItems.filter(item => item.projectId === project.id),
        [budgetItems, project.id]
    );

    const projectExpenses = expenses.filter(expense => expense.projectId === project.id);

    const groupedBudgetItems = useMemo(() => {
        if (!showGroupByCategory) return null;
        
        const groups: { [key: string]: BudgetItem[] } = projectBudgetItems.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {} as { [key: string]: BudgetItem[] });

        return Object.entries(groups).map(([category, items]) => {
            const committedCost = projectExpenses
                .filter(exp => exp.category === category)
                .reduce((sum, exp) => sum + exp.amount, 0);

            const originalBudget = items.reduce((sum, item) => sum + item.originalBudget, 0);
            const approvedCOBudget = items.reduce((sum, item) => sum + item.approvedCOBudget, 0);

            return {
                category,
                items,
                subtotals: {
                    originalBudget,
                    approvedCOBudget,
                    revisedBudget: originalBudget + approvedCOBudget,
                    committedCost: committedCost,
                    projectedCost: items.reduce((sum, item) => sum + item.projectedCost, 0), // This might need adjustment based on desired logic
                }
            }
        }).sort((a,b) => a.category.localeCompare(b.category));

    }, [projectBudgetItems, showGroupByCategory, projectExpenses]);
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleNewItem = () => {
        setSelectedBudgetItem(null);
        setDialogOpen(true);
    };

    const handleEditItem = (item: BudgetItem) => {
        setSelectedBudgetItem(item);
        setDialogOpen(true);
    };

    const handleDeleteItem = (itemId: string) => {
        setBudgetItems(current => current.filter(item => item.id !== itemId));
        toast({
            title: "Budget Item Deleted",
            description: "The item has been removed from the budget.",
            variant: "destructive"
        });
    };

    const handleDeleteSelected = () => {
        setBudgetItems(current => current.filter(item => !selectedRowKeys.includes(item.id)));
        toast({
            title: `${selectedRowKeys.length} Budget Item(s) Deleted`,
            description: "The selected items have been removed from the budget.",
            variant: "destructive"
        });
        setSelectedRowKeys([]);
    };

    const handleSaveItem = (itemToSave: BudgetItem) => {
        if (itemToSave.id) {
            setBudgetItems(current => current.map(item => item.id === itemToSave.id ? itemToSave : item));
        } else {
            setBudgetItems(current => [{...itemToSave, id: crypto.randomUUID()}, ...current]);
        }
    };
    
    const handleTransactionsClick = (category: string) => {
        setSelectedCategory(category);
        setTransactionsDialogOpen(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && appState) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }) as any[][];

                    const parseAmount = (value: any): number => {
                        if (value === null || value === undefined) return 0;
                        if (typeof value === 'number') return value;
                        if (typeof value === 'string') {
                          const cleaned = value.replace(/[^0-9.-]+/g, '');
                          const num = parseFloat(cleaned);
                          return isNaN(num) ? 0 : num;
                        }
                        return 0;
                    };

                    const newBudgetItems: BudgetItem[] = rows.map((row: any[]): BudgetItem | null => {
                        if (!row || row.length === 0) {
                            return null;
                        }

                        const notes = row[0] ? String(row[0]).trim() : '';
                        const category = row[1] ? String(row[1]).trim() : '';
                        const originalBudget = parseAmount(row[3]); // Column 4 is index 3

                        // Strictest validation yet: Only import if the first column has text.
                        if (notes === '') {
                            return null;
                        }

                        let costType: 'labor' | 'material' | 'both' = 'both';
                        const notesLower = notes.toLowerCase();
                        if (notesLower.includes('labor')) {
                            costType = 'labor';
                        } else if (notesLower.includes('material')) {
                            costType = 'material';
                        }
                        
                        return {
                            id: crypto.randomUUID(),
                            projectId: project.id,
                            category: category,
                            costType: costType,
                            notes: notes,
                            originalBudget: originalBudget,
                            approvedCOBudget: 0,
                            committedCost: 0,
                            projectedCost: originalBudget,
                        };
                    }).filter((item): item is BudgetItem => item !== null);
                    
                    if (newBudgetItems.length > 0) {
                        appState.setBudgetItems(current => [...current, ...newBudgetItems]);
                        toast({
                            title: "Import Successful",
                            description: `${newBudgetItems.length} budget items have been imported.`,
                        });
                    } else {
                        toast({
                            title: "Import Warning",
                            description: "No valid data found to import. Please ensure your file has data in the first column.",
                            variant: 'destructive'
                        });
                    }
                } catch (error) {
                    console.error("Error importing budget:", error);
                    toast({
                        title: "Import Failed",
                        description: "There was an error processing the file. Please ensure it's a valid XLSX file.",
                        variant: "destructive",
                    });
                }
            };
            reader.readAsArrayBuffer(file);
        }
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const totals = useMemo(() => {
        const committedCost = projectExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const originalBudget = projectBudgetItems.reduce((sum, item) => sum + item.originalBudget, 0);
        const approvedCOBudget = projectBudgetItems.reduce((sum, item) => sum + item.approvedCOBudget, 0);

        return {
            originalBudget,
            approvedCOBudget,
            revisedBudget: originalBudget + approvedCOBudget,
            committedCost,
            projectedCost: projectBudgetItems.reduce((sum, item) => sum + item.projectedCost, 0),
        }
    }, [projectBudgetItems, projectExpenses]);

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <AddEditBudgetItemDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                projectId={project.id}
                budgetItem={selectedBudgetItem}
                onSave={handleSaveItem}
            />
             {selectedCategory && (
                <TransactionsDialog
                    open={transactionsDialogOpen}
                    onOpenChange={setTransactionsDialogOpen}
                    category={selectedCategory}
                    expenses={projectExpenses.filter(exp => exp.category === selectedCategory)}
                />
            )}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">Project Budget</CardTitle>
                            <CardDescription>Detailed cost breakdown for {project.name}.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             {selectedRowKeys.length > 0 ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete ({selectedRowKeys.length})
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete {selectedRowKeys.length} budget item(s).
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="group-by-category" checked={showGroupByCategory} onCheckedChange={setShowGroupByCategory}/>
                                        <Label htmlFor="group-by-category">Group by Category</Label>
                                    </div>
                                    <Button variant="outline" onClick={handleImportClick}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Import
                                    </Button>
                                </>
                            )}
                            <Button onClick={handleNewItem}>
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
                                <TableHead className="w-[40px]">
                                    <Checkbox
                                        checked={selectedRowKeys.length > 0 && projectBudgetItems.length > 0 && selectedRowKeys.length === projectBudgetItems.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedRowKeys(projectBudgetItems.map(item => item.id));
                                            } else {
                                                setSelectedRowKeys([]);
                                            }
                                        }}
                                        aria-label="Select all rows"
                                        disabled={showGroupByCategory}
                                    />
                                </TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Cost Type</TableHead>
                                <TableHead className="text-right">Original Budget</TableHead>
                                <TableHead className="text-right">Approved COs</TableHead>
                                <TableHead className="text-right">Revised Budget</TableHead>
                                <TableHead className="text-right">Committed Cost</TableHead>
                                <TableHead className="text-right">Projected Cost</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        {showGroupByCategory && groupedBudgetItems ? (
                            <TableBody>
                                {groupedBudgetItems.map(({ category, items, subtotals }) => (
                                    <React.Fragment key={category}>
                                        <TableRow className="bg-secondary hover:bg-secondary">
                                            <TableCell></TableCell>
                                            <TableCell colSpan={3} className="font-bold text-secondary-foreground">{category}</TableCell>
                                            <TableCell className="text-right font-bold text-secondary-foreground">${subtotals.originalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-right font-bold text-secondary-foreground">${subtotals.approvedCOBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-right font-bold text-secondary-foreground">${subtotals.revisedBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-right font-bold text-secondary-foreground">
                                                <Button variant="link" className="p-0 h-auto text-secondary-foreground" onClick={() => handleTransactionsClick(category)}>
                                                    ${subtotals.committedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-secondary-foreground">${subtotals.projectedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {projectBudgetItems.map((item) => {
                                    const revisedBudget = item.originalBudget + item.approvedCOBudget;
                                    const committedCost = projectExpenses
                                        .filter(exp => exp.category === item.category)
                                        .reduce((sum, exp) => sum + exp.amount, 0);
                                    return (
                                        <TableRow key={item.id} data-state={selectedRowKeys.includes(item.id) && "selected"}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedRowKeys.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedRowKeys(prev => [...prev, item.id]);
                                                        } else {
                                                            setSelectedRowKeys(prev => prev.filter(id => id !== item.id));
                                                        }
                                                    }}
                                                    aria-label="Select row"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.notes}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.costType}</TableCell>
                                            <TableCell className="text-right">${item.originalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-right">${item.approvedCOBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-right font-semibold">${revisedBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="link" className="p-0 h-auto" onClick={() => handleTransactionsClick(item.category)}>
                                                    ${committedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">${item.projectedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEditItem(item)}>Edit</DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete this budget item.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        )}
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} className="font-bold">Totals</TableCell>
                                <TableCell className="text-right font-bold">${totals.originalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right font-bold">${totals.approvedCOBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right font-bold">${totals.revisedBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right font-bold">${totals.committedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right font-bold">${totals.projectedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
