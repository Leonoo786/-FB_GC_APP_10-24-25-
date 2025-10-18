
'use client';

import { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppStateContext } from '@/context/app-state-context';
import { AddEditVendorDialog } from './_components/add-edit-vendor-dialog';
import type { Vendor } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';


export default function VendorsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const appState = useContext(AppStateContext);
    const { toast } = useToast();

    if (!appState) {
        return <div>Loading...</div>;
    }

    const { vendors, setVendors } = appState;

    const handleNewVendor = () => {
        setSelectedVendor(null);
        setDialogOpen(true);
    };

    const handleEditVendor = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setDialogOpen(true);
    };

    const handleDeleteVendor = (vendorId: string) => {
        setVendors(current => current.filter(v => v.id !== vendorId));
        toast({
            title: "Vendor Deleted",
            description: "The vendor has been successfully deleted.",
            variant: "destructive"
        });
    };

    const handleSave = (vendor: Vendor) => {
        if (selectedVendor) {
            // Edit
            setVendors(current => current.map(v => v.id === vendor.id ? vendor : v));
        } else {
            // Add
            setVendors(current => [{...vendor, id: crypto.randomUUID()}, ...current]);
        }
    };


    return (
        <>
            <AddEditVendorDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                vendor={selectedVendor}
                onSave={handleSave}
            />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
                        <p className="text-muted-foreground">
                            Manage a master list of all company vendors and subcontractors.
                        </p>
                    </div>
                    <Button onClick={handleNewVendor}>
                        <PlusCircle className="mr-2" />
                        New Vendor
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>All Vendors</CardTitle>
                        <CardDescription>A list of all vendors and subcontractors available for your projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Trade</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.sort((a, b) => a.name.localeCompare(b.name)).map(vendor => (
                                    <TableRow key={vendor.id}>
                                        <TableCell className="font-medium">{vendor.name}</TableCell>
                                        <TableCell>{vendor.trade}</TableCell>
                                        <TableCell>{vendor.contactPerson}</TableCell>
                                        <TableCell>{vendor.phone}</TableCell>
                                        <TableCell>{vendor.email}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEditVendor(vendor)}>Edit</DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the vendor &quot;{vendor.name}&quot;.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteVendor(vendor.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
