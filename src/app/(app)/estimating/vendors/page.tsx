'use client';

import { useState, useContext, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppStateContext } from '@/context/app-state-context';
import { AddEditVendorDialog } from './_components/add-edit-vendor-dialog';
import type { Vendor } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as XLSX from 'xlsx';

export default function VendorsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const appState = useContext(AppStateContext);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);


    if (!appState) {
        return <div>Loading...</div>;
    }

    const { vendors, setVendors } = appState;

    const sortedVendors = useMemo(() => vendors.sort((a, b) => a.name.localeCompare(b.name)), [vendors]);

    const handleNewVendor = () => {
        setSelectedVendor(null);
        setDialogOpen(true);
    };

    const handleEditVendor = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setDialogOpen(true);
    };

    const handleDeleteVendor = (vendorId: string) => {
        setVendors(prev => prev.filter(v => v.id !== vendorId));
        toast({
            title: "Vendor Deleted",
            description: "The vendor has been successfully deleted.",
            variant: "destructive"
        });
    };

     const handleDeleteSelected = () => {
        setVendors(current => current.filter(v => !selectedRowKeys.includes(v.id)));
        toast({
            title: `${selectedRowKeys.length} Vendor(s) Deleted`,
            description: "The selected vendors have been removed.",
            variant: "destructive"
        });
        setSelectedRowKeys([]);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
                
                const newVendors: Vendor[] = json.slice(1).map(row => {
                    if (!row || row.length === 0 || !row[0]) return null;
                    return {
                        id: crypto.randomUUID(),
                        name: row[0] || '',
                        trade: row[1] || 'N/A',
                        contactPerson: row[2] || 'N/A',
                        phone: row[3] || 'N/A',
                        email: row[4] || 'N/A'
                    };
                }).filter((v): v is Vendor => v !== null);

                if (newVendors.length > 0) {
                    setVendors(current => [...current, ...newVendors]);
                    toast({
                        title: 'Import Successful',
                        description: `${newVendors.length} vendors have been imported.`,
                    });
                } else {
                     toast({
                        title: 'Import Warning',
                        description: 'No valid vendors found in the file.',
                        variant: 'destructive',
                    });
                }
            } catch (error) {
                console.error('Error importing vendors:', error);
                toast({
                    title: 'Import Failed',
                    description: 'There was an error processing your file.',
                    variant: 'destructive',
                });
            }
        };

        reader.readAsArrayBuffer(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".xlsx, .xls, .csv, .txt"
            />
            <AddEditVendorDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                vendor={selectedVendor}
            />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
                        <p className="text-muted-foreground">
                            Manage a master list of all company vendors and subcontractors.
                        </p>
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
                                            This action cannot be undone. This will permanently delete {selectedRowKeys.length} vendor(s).
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
                                <Button variant="outline" onClick={handleImportClick}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import
                                </Button>
                                <Button onClick={handleNewVendor}>
                                    <PlusCircle className="mr-2" />
                                    New Vendor
                                </Button>
                            </>
                        )}
                    </div>
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
                                    <TableHead className="w-[40px]">
                                        <Checkbox
                                            checked={selectedRowKeys.length > 0 && selectedRowKeys.length === sortedVendors.length}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRowKeys(sortedVendors.map(v => v.id));
                                                } else {
                                                    setSelectedRowKeys([]);
                                                }
                                            }}
                                            aria-label="Select all rows"
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Trade</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedVendors.map(vendor => (
                                    <TableRow key={vendor.id} data-state={selectedRowKeys.includes(vendor.id) && "selected"}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedRowKeys.includes(vendor.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedRowKeys(prev => [...prev, vendor.id]);
                                                    } else {
                                                        setSelectedRowKeys(prev => prev.filter(id => id !== vendor.id));
                                                    }
                                                }}
                                                aria-label="Select row"
                                            />
                                        </TableCell>
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