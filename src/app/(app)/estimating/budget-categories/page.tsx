
'use client';

import { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppStateContext } from '@/context/app-state-context';
import { AddEditBudgetCategoryDialog } from './_components/add-edit-budget-category-dialog';
import type { BudgetCategory } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function BudgetCategoriesPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
    const appState = useContext(AppStateContext);
    const { toast } = useToast();

    if (!appState) {
        return <div>Loading...</div>;
    }

    const { budgetCategories, setBudgetCategories } = appState;

    const handleNewCategory = () => {
        setSelectedCategory(null);
        setDialogOpen(true);
    };

    const handleEditCategory = (category: BudgetCategory) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    const handleDeleteCategory = (categoryId: string) => {
        setBudgetCategories(current => current.filter(c => c.id !== categoryId));
        toast({
            title: "Category Deleted",
            description: "The budget category has been successfully deleted.",
            variant: "destructive"
        });
    };

    const handleSave = (category: BudgetCategory) => {
        if (selectedCategory && category.id) {
            // Edit
            setBudgetCategories(current => current.map(c => c.id === category.id ? category : c));
        } else {
            // Add
            setBudgetCategories(current => [{...category, id: crypto.randomUUID()}, ...current]);
        }
    };


    return (
        <>
            <AddEditBudgetCategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={selectedCategory}
                onSave={handleSave}
            />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Budget Categories</h1>
                        <p className="text-muted-foreground">
                            Manage a master list of budget categories.
                        </p>
                    </div>
                    <Button onClick={handleNewCategory}>
                        <PlusCircle className="mr-2" />
                        New Category
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                        <CardDescription>A list of all predefined budget categories for your projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {budgetCategories.sort((a, b) => a.name.localeCompare(b.name)).map(category => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEditCategory(category)}>Edit</DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the category &quot;{category.name}&quot;.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
