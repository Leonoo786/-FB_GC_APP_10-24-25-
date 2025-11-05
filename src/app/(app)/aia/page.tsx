
'use client';

import { useState, useContext, useEffect } from 'react';
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
import { format, isValid } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useForm, Controller } from 'react-hook-form';
import type { ChangeOrder } from '@/lib/types';

type FormValues = {
    applicationNo: string;
    periodTo: Date;
    architectName: string;
    totalCompletedAndStored: number;
    retainagePercentage: number;
    storedMaterialRetainagePercentage: number;
    previousCertificates: number;
    amountCertified: number;
};

export default function AIAPage() {
  const appState = useContext(AppStateContext);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { control, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      applicationNo: '',
      architectName: '',
      totalCompletedAndStored: 0,
      retainagePercentage: 10,
      storedMaterialRetainagePercentage: 10,
      previousCertificates: 0,
      amountCertified: 0,
      periodTo: new Date(),
    }
  });

  const formValues = watch();

  useEffect(() => {
    if (selectedProjectId && appState) {
        const project = appState.projects.find(p => p.id === selectedProjectId);
        if (project) {
            // Reset some fields when project changes to avoid carrying over old data
            setValue('totalCompletedAndStored', 0);
            setValue('previousCertificates', 0);
        }
    }
  }, [selectedProjectId, appState, setValue]);


  if (!appState) {
    return <div>Loading...</div>;
  }

  const { projects, companyName, changeOrders, budgetItems } = appState;
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const projectChangeOrders: ChangeOrder[] = selectedProject
    ? changeOrders.filter(co => co.projectId === selectedProject.id && (co.status === 'Approved' || co.status === 'Executed'))
    : [];

  const totalAdditions = projectChangeOrders.reduce((sum, co) => co.totalRequest > 0 ? sum + co.totalRequest : sum, 0);
  const totalDeductions = projectChangeOrders.reduce((sum, co) => co.totalRequest < 0 ? sum + co.totalRequest : sum, 0);
  const netChangeByChangeOrders = totalAdditions + totalDeductions;

  const originalContractSum = selectedProject ? budgetItems.filter(bi => bi.projectId === selectedProject.id).reduce((sum, item) => sum + item.originalBudget, 0) : 0;
  const contractSumToDate = originalContractSum + netChangeByChangeOrders;
  const totalCompletedAndStored = formValues.totalCompletedAndStored || 0;
  
  const retainageOfCompletedWork = totalCompletedAndStored * (formValues.retainagePercentage / 100);
  const retainageOfStoredMaterial = 0; // Assuming 0 for now, can be an input later
  const totalRetainage = retainageOfCompletedWork + retainageOfStoredMaterial;
  
  const totalEarnedLessRetainage = totalCompletedAndStored - totalRetainage;
  const lessPreviousCertificates = formValues.previousCertificates || 0;
  const currentPaymentDue = totalEarnedLessRetainage - lessPreviousCertificates;
  const balanceToFinish = contractSumToDate - totalEarnedLessRetainage;


  const aiaTableRows = [
    { id: 1, description: '1. Original Contract Sum', value: originalContractSum },
    { id: 2, description: '2. Net change by Change Orders', value: netChangeByChangeOrders },
    { id: 3, description: '3. Contract Sum to Date (Line 1 ± 2)', value: contractSumToDate },
    { id: 4, description: '4. Total Completed & Stored to Date', isInput: true, fieldName: 'totalCompletedAndStored', value: totalCompletedAndStored },
    { id: 5, description: '5. Retainage', subDescription: 'a. % of Completed Work', value: retainageOfCompletedWork, isRetainageInput: true, fieldName: 'retainagePercentage' },
    { id: 6, description: null, subDescription: 'b. % of Stored Material', value: retainageOfStoredMaterial, isRetainageInput: true, fieldName: 'storedMaterialRetainagePercentage' },
    { id: 7, description: '6. Total Retainage (Lines 5a + 5b)', value: totalRetainage },
    { id: 8, description: '7. Total Earned Less Retainage (Line 4 - Line 6 Total)', value: totalEarnedLessRetainage },
    { id: 9, description: '8. Less Previous Certificates for Payment', isInput: true, fieldName: 'previousCertificates', value: lessPreviousCertificates },
    { id: 10, description: '9. Current Payment Due', value: currentPaymentDue },
    { id: 11, description: '10. Balance to Finish, Including Retainage', value: balanceToFinish },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AIA G702 Application for Payment
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
                 <Select onValueChange={setSelectedProjectId} value={selectedProjectId || undefined}>
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
                    <Input readOnly value={companyName || 'N/A'} />
                </div>
                <div>
                    <Label>Project</Label>
                    <Input readOnly value={selectedProject?.name || 'N/A'} />
                </div>
                 <Controller
                    name="architectName"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <Label>Via (Architect)</Label>
                            <Input placeholder="Enter Architect Name" {...field} />
                        </div>
                    )}
                 />
             </div>
        </CardContent>
         <CardHeader>
            <CardTitle>Application Details</CardTitle>
        </CardHeader>
         <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="application-no">Application No.</Label>
                <Controller
                    name="applicationNo"
                    control={control}
                    render={({ field }) => (
                        <Input id="application-no" placeholder="e.g., 003" {...field} />
                    )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period-to">Period To</Label>
                <Controller
                    name="periodTo"
                    control={control}
                    render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value && isValid(new Date(field.value)) ? format(new Date(field.value), 'PP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                    )}
                />
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
                    {row.isRetainageInput && (
                        <Controller
                            name={row.fieldName as keyof FormValues}
                            control={control}
                            render={({ field }) => (
                                <Input 
                                    type="number" 
                                    className="w-16 h-6 inline-block ml-2 px-1 text-center"
                                    {...field}
                                    value={field.value || 0}
                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            )}
                        />
                    )}
                     <span className={cn('ml-1', !row.isRetainageInput && 'hidden')}>%</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.isInput ? (
                        <Controller
                            name={row.fieldName as keyof FormValues}
                            control={control}
                            render={({ field }) => (
                                <Input 
                                    type="number" 
                                    className="w-48 h-8 ml-auto text-right"
                                    {...field}
                                    value={field.value || 0}
                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            )}
                        />
                    ) : (
                        row.value.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })
                    )}
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
                        <TableHead>CO #</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">ADDITIONS</TableHead>
                        <TableHead className="text-right">DEDUCTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projectChangeOrders.map((co) => (
                        <TableRow key={co.id}>
                            <TableCell>{co.coNumber}</TableCell>
                            <TableCell>{co.description}</TableCell>
                            <TableCell className="text-right">{co.totalRequest > 0 ? co.totalRequest.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00'}</TableCell>
                             <TableCell className="text-right">{co.totalRequest < 0 ? co.totalRequest.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00'}</TableCell>
                        </TableRow>
                    ))}
                    {projectChangeOrders.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No approved change orders for this project.</TableCell></TableRow>}
                </TableBody>
                <TableFooter>
                     <TableRow>
                        <TableCell colSpan={2} className="font-bold text-right">TOTALS</TableCell>
                        <TableCell className="text-right font-bold">{(totalAdditions).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                        <TableCell className="text-right font-bold">{(totalDeductions).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell colSpan={3} className="font-bold text-right">NET CHANGE BY CHANGE ORDERS</TableCell>
                        <TableCell className="text-right font-bold">{(netChangeByChangeOrders).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
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
                    <Controller
                        name="amountCertified"
                        control={control}
                        render={({ field }) => (
                           <Input 
                                type="number" 
                                placeholder="$0.00" 
                                {...field}
                                value={field.value || 0}
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                           />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Architect Signature</Label>
                    <Input disabled placeholder='Signature required after printing' />
                </div>
             </div>
          </CardContent>
      </Card>
    </div>
  );
}
