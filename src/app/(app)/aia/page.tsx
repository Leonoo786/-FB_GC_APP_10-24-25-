
'use client';

import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AppStateContext } from '@/context/app-state-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

export default function AIAPage() {
  const appState = useContext(AppStateContext);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (!appState) {
    return <div>Loading...</div>;
  }

  const { projects } = appState;
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const aiaTableRows = [
    { id: 1, description: '1. Original Contract Sum', value: 1000000.00 },
    { id: 2, description: '2. Net change by Change Orders', value: 50000.00 },
    { id: 3, description: '3. Contract Sum to Date (Line 1 ± 2)', value: 1050000.00 },
    { id: 4, description: '4. Total Completed & Stored to Date', value: 525000.00 },
    { id: 5, description: '5. Retainage', subDescription: 'a. 10% of Completed Work', value: 52500.00 },
    { id: 6, description: null, subDescription: 'b. 10% of Stored Material', value: 0.00 },
    { id: 7, description: '6. Total Retainage (Lines 5a + 5b)', value: 52500.00 },
    { id: 8, description: '7. Total Earned Less Retainage (Line 4 - Line 6 Total)', value: 472500.00 },
    { id: 9, description: '8. Less Previous Certificates for Payment', value: 200000.00 },
    { id: 10, description: '9. Current Payment Due', value: 272500.00 },
    { id: 11, description: '10. Balance to Finish, Including Retainage', value: 577500.00 },
  ];
  
  const changeOrderRows = [
    { date: '2024-02-15', description: 'CO-001: Additional electrical outlets in main hall', additions: 25000.00, deductions: 0.00 },
    { date: '2024-03-01', description: 'CO-002: Owner requested change to lobby finishes', additions: 30000.00, deductions: 0.00 },
    { date: '2024-03-20', description: 'CO-003: Credit for switching to alternative flooring', additions: 0.00, deductions: 5000.00 },
  ];

  const totalAdditions = changeOrderRows.reduce((sum, co) => sum + co.additions, 0);
  const totalDeductions = changeOrderRows.reduce((sum, co) => sum + co.deductions, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AIA G702/G703 Application for Payment
          </h1>
          <p className="text-muted-foreground">
            Create and manage your payment applications.
          </p>
        </div>
         <div className="flex gap-2">
            <Button variant="outline"><Printer className="mr-2" /> Print</Button>
            <Button><Download className="mr-2" /> Export as PDF</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>Select Project</Label>
                 <Select onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a project to auto-fill details" />
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                            {project.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>To (Owner)</Label>
                    <Input readOnly value={selectedProject?.ownerName || 'N/A'}/>
                </div>
                <div>
                    <Label>From (Contractor)</Label>
                    <Input readOnly value={appState.companyName || 'N/A'} />
                </div>
                <div>
                    <Label>Project</Label>
                    <Input readOnly value={selectedProject?.name || 'N/A'} />
                </div>
                <div>
                    <Label>Via (Architect)</Label>
                    <Input placeholder="Enter Architect Name" />
                </div>
             </div>
        </CardContent>
         <CardHeader>
            <CardTitle>Application Details</CardTitle>
        </CardHeader>
         <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="application-no">Application No.</Label>
                <Input id="application-no" placeholder="e.g., 003" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period-to">Period To</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Pick a date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" initialFocus />
                    </PopoverContent>
                </Popover>
              </div>
               <div className="space-y-2">
                <Label htmlFor="contract-date">Contract Date</Label>
                 <Input id="contract-date" readOnly value={selectedProject ? format(new Date(selectedProject.startDate), 'PP') : 'N/A'}/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="project-no">Project No.</Label>
                <Input id="project-no" readOnly value={selectedProject?.projectNumber || 'N/A'} />
              </div>
         </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contractor&apos;s Application for Payment</CardTitle>
          <CardDescription>
            Summary of the contract sum, changes, and payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aiaTableRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className={cn("font-medium", !row.description && "pl-8")}>
                    {row.description || row.subDescription}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.value.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Change Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Additions</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {changeOrderRows.map((co, index) => (
                        <TableRow key={index}>
                            <TableCell>{co.date}</TableCell>
                            <TableCell>{co.description}</TableCell>
                            <TableCell className="text-right">{co.additions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            <TableCell className="text-right text-destructive">({co.deductions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2} className="font-bold">Totals</TableCell>
                        <TableCell className="text-right font-bold">{totalAdditions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                        <TableCell className="text-right font-bold text-destructive">({totalDeductions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell colSpan={2} className="font-bold">Net Change by Change Orders</TableCell>
                        <TableCell colSpan={2} className="text-right font-bold">{(totalAdditions - totalDeductions).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                    </TableRow>
                </TableFooter>
             </Table>
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
            <CardTitle>Architect&apos;s Certificate for Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
                In accordance with the Contract Documents, based on on-site observations and the data comprising this application, the Architect certifies to the Owner that to the best of the Architect&apos;s knowledge, information and belief the Work has progressed as indicated, the quality of the Work is in accordance with the Contract Documents, and the Contractor is entitled to payment of the AMOUNT CERTIFIED.
            </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Amount Certified</Label>
                    <Input placeholder="$0.00" />
                </div>
                <div className="space-y-2">
                    <Label>Architect Signature</Label>
                    <Input disabled />
                </div>
             </div>
          </CardContent>
      </Card>
    </div>
  );
}
