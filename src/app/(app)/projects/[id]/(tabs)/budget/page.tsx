
'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState, useContext, useRef, useMemo } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, ArrowUpDown, Upload, Trash2 } from "lucide-react";
import { AddEditBudgetItemDialog } from "../../_components/add-edit-budget-item-dialog";
import { AppStateContext } from "@/context/app-state-context";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import type { BudgetItem } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PasteBudgetDialog } from "../../_components/paste-budget-dialog";
import { TransactionsDialog } from "../../_components/transactions-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "next/navigation";


export default function ProjectBudgetPage() {
    const params = useParams<{ id: string }>();
    const appState = useContext(AppStateContext);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [transactionsDialogOpen, setTransactionsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [pasteDialogOpen, setPasteDialogOpen] = useState(false);
    const [selectedBudgetItem, setSelectedBudgetItem] = useState<BudgetItem | null>(null);
    const [showGroupByCategory, setShowGroupByCategory] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'notes', direction: 'asc'});

    const project = appState?.projects.find(p => p.id === params.id);
    
    if (!appState || !project) {
        return null;
    }
    
    const { budgetItems, setBudgetItems, expenses, budgetCategories } = appState;
    
    const projectBudgetItems = useMemo(() => budgetItems.filter(item => item.projectId === project.id), [budgetItems, project.id]);
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
            const projectedCost = items.reduce((sum, item) => sum + item.projectedCost, 0);

            return {
                category,
                items,
                subtotals: {
                    originalBudget,
                    approvedCOBudget,
                    revisedBudget: originalBudget + approvedCOBudget,
                    committedCost,
                    projectedCost,
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

                    const importedItems = rows.map((row) => {
                        if (!row || row.length < 4) return null;
            
                        const notes = row[0] ? String(row[0]).trim() : '';
                        const category = row[1] ? String(row[1]).trim() : '';
                        
                        if (!notes || !category) {
                            return null;
                        }

                        const parseAmount = (value: any): number => {
                            if (value === null || value === undefined) return 0;
                            if (typeof value === 'number') return value;
                            if (typeof value === 'string') {
                              const cleaned = value.replace(/[^0-9.]/g, '');
                              const num = parseFloat(cleaned);
                              return isNaN(num) ? 0 : num;
                            }
                            return 0;
                        };
            
                        const originalBudget = parseAmount(row[3]);
            
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


                    if (importedItems.length > 0) {
                        appState.setBudgetItems(current => [...current, ...importedItems]);
                        toast({
                            title: "Import Successful",
                            description: `${importedItems.length} budget items have been imported.`
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
    

    const filteredAndSortedItems = useMemo(() => {
        let items = projectBudgetItems;
        if (categoryFilter !== 'all') {
            items = items.filter(item => item.category === categoryFilter);
        }

        if (sortConfig !== null) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof BudgetItem] as any;
                const bValue = b[sortConfig.key as keyof BudgetItem] as any;
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return items;

    }, [projectBudgetItems, categoryFilter, sortConfig]);

    const requestSort = (key: keyof BudgetItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
            <PasteBudgetDialog 
                open={pasteDialogOpen}
                onOpenChange={setPasteDialogOpen}
                projectId={project.id}
            />
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl">Project Budget</CardTitle>
                            <CardDescription>Detailed cost breakdown for {project.name}.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
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
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {budgetCategories.sort((a,b) => a.name.localeCompare(b.name)).map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" onClick={handleImportClick}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Import
                                    </Button>
                                    <Button variant="outline" onClick={() => setPasteDialogOpen(true)}>
                                        Paste
                                    </Button>
                                </>
                            )}
                            <Button onClick={handleNewItem}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {showGroupByCategory && groupedBudgetItems ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Original Budget</TableHead>
                                    <TableHead className="text-right">Approved COs</TableHead>
                                    <TableHead className="text-right">Revised Budget</TableHead>
                                    <TableHead className="text-right">Committed Cost</TableHead>
                                    <TableHead className="text-right">Projected Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groupedBudgetItems.map(({ category, subtotals }) => (
                                    <TableRow key={category} className="bg-secondary hover:bg-secondary/80 font-bold">
                                        <TableCell>{category}</TableCell>
                                        <TableCell className="text-right">${subtotals.originalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right">${subtotals.approvedCOBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right">${subtotals.revisedBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="link" className="p-0 h-auto text-secondary-foreground" onClick={() => handleTransactionsClick(category)}>
                                                ${subtotals.committedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">${subtotals.projectedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="font-bold">Totals</TableCell>
                                    <TableCell className="text-right font-bold">${totals.originalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right font-bold">${totals.approvedCOBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right font-bold">${totals.revisedBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right font-bold">${totals.committedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right font-bold">${totals.projectedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px]">
                                        <Checkbox
                                            checked={selectedRowKeys.length > 0 && selectedRowKeys.length === filteredAndSortedItems.length}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRowKeys(filteredAndSortedItems.map(item => item.id));
                                                } else {
                                                    setSelectedRowKeys([]);
                                                }
                                            }}
                                            aria-label="Select all rows"
                                        />
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => requestSort('notes')}>
                                            Notes
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
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
                            <TableBody>
                                {filteredAndSortedItems.map((item) => {
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
                                                        setSelectedRowKeys(prev => 
                                                            checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
                                                        );
                                                    }}
                                                    aria-label="Select row"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.notes}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell className="capitalize">{item.costType}</TableCell>
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
                                    )
                                })}
                            </TableBody>
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
                    )}
                </CardContent>
            </Card>
        </>
    );
    
}
