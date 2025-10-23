
'use client';

import { useContext, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppStateContext } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format, isValid, parseISO } from 'date-fns';
import type {
  Project,
  BudgetItem,
  Expense,
  Vendor,
  TeamMember,
  BudgetCategory,
  Task,
} from '@/lib/types';

type DataType =
  | 'projects'
  | 'vendors'
  | 'team'
  | 'budgetCategories'
  | 'tasks'
  | 'budgetItems'
  | 'expenses';

export default function ImportExportPage() {
  const appState = useContext(AppStateContext);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImportType = useRef<DataType | null>(null);

  if (!appState) {
    return <div>Loading...</div>;
  }

  const {
    projects,
    vendors,
    teamMembers,
    budgetCategories,
    tasks,
    budgetItems,
    expenses,
    setProjects,
    setVendors,
    setTeamMembers,
    setBudgetCategories,
    setTasks,
    setBudgetItems,
    setExpenses,
  } = appState;

  const parseDate = (dateInput: string | number): Date | null => {
    // Handle Excel's serial date format (numbers)
    if (typeof dateInput === 'number') {
      // Excel's epoch starts on 1899-12-30 for compatibility with Lotus 1-2-3.
      // The number represents days since this epoch.
      // JavaScript's epoch is 1970-01-01.
      // So, we calculate milliseconds from Excel's number.
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      // Subtract 1 because Excel's date system has a bug where it considers 1900 a leap year.
      // This is not needed if the date is after Feb 1900, but it's a common adjustment.
      const date = new Date(excelEpoch.getTime() + (dateInput - 1) * millisecondsPerDay);
      if (isValid(date)) {
        return date;
      }
    }
    
    // Handle string dates (ISO, common formats)
    if (typeof dateInput === 'string') {
        const cleanedDateString = dateInput.trim().replace(/\.$/, ''); // Clean trailing dots
        let date = parseISO(cleanedDateString);
        if (isValid(date)) return date;

        date = new Date(cleanedDateString);
        if (isValid(date)) return date;
    }

    return null;
  };

  const handleImportClick = (type: DataType) => {
    currentImportType.current = type;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentImportType.current) return;

    const importType = currentImportType.current;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: '',
        }) as any[];

        let count = 0;

        switch (importType) {
          case 'expenses':
            const newExpenses = json
              .map((row): Expense | null => {
                const date = parseDate(row.Date);
                const amount = parseFloat(
                  String(row.Amount || '0').replace(/[^0-9.-]+/g, '')
                );

                if (!date || !amount) return null;

                count++;
                return {
                  id: crypto.randomUUID(),
                  projectId: row.ProjectId || 'proj-1', // Default for now
                  date: format(date, 'yyyy-MM-dd'),
                  category: row.Category,
                  vendorName: row.Vendor,
                  description: row.Description,
                  amount: amount,
                  paymentMethod: row['Payment Method'] || row['Payment\nMethod'],
                  paymentReference: row.Reference,
                  invoiceNumber: row['Invoice #'],
                };
              })
              .filter((i): i is Expense => i !== null);
            setExpenses((current) => [...current, ...newExpenses]);
            break;
            // Add cases for other data types here
        }

        if (count === 0 && json.length > 0) {
            toast({
                title: 'Import Warning',
                description: `Could not import any valid ${importType}. Please check your file's format and column headers.`,
                variant: 'destructive',
            });
            return;
        }

        toast({
          title: 'Import Successful',
          description: `${count} ${importType} record(s) have been imported.`,
        });
      } catch (error) {
        console.error(`Error importing ${importType}:`, error);
        toast({
          title: 'Import Failed',
          description:
            'There was an error processing the file. Please check the file format and column headers.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    currentImportType.current = null;
  };
  
  const handleExport = (dataType: DataType) => {
    try {
        let dataToExport;
        let sheetName: string;

        switch (dataType) {
            case 'projects':
                dataToExport = projects;
                sheetName = 'Projects';
                break;
            case 'expenses':
                dataToExport = expenses;
                sheetName = 'Expenses';
                break;
            case 'budgetItems':
                dataToExport = budgetItems;
                sheetName = 'BudgetItems';
                break;
             case 'vendors':
                dataToExport = vendors;
                sheetName = 'Vendors';
                break;
             case 'team':
                dataToExport = teamMembers;
                sheetName = 'TeamMembers';
                break;
             case 'budgetCategories':
                dataToExport = budgetCategories;
                sheetName = 'BudgetCategories';
                break;
            case 'tasks':
                dataToExport = tasks;
                sheetName = 'Tasks';
                break;
            default:
                throw new Error('Invalid data type for export');
        }

        if (dataToExport.length === 0) {
            toast({
                title: "Export Empty",
                description: `There is no data to export for ${sheetName}.`,
                variant: 'destructive'
            });
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, `${sheetName}_Export_${new Date().toISOString().split('T')[0]}.xlsx`);

        toast({
            title: "Export Successful",
            description: `${sheetName} data has been exported.`,
        });

    } catch (error) {
        console.error('Export failed:', error);
        toast({
            title: "Export Failed",
            description: "An unexpected error occurred during the export.",
            variant: "destructive"
        });
    }
  };


  const dataTypes: {
    key: DataType;
    label: string;
    description: string;
  }[] = [
    {
      key: 'projects',
      label: 'Projects',
      description: 'Import or export core project information.',
    },
    {
      key: 'expenses',
      label: 'Expenses',
      description: 'Import or export all expense and cost records.',
    },
    {
      key: 'budgetItems',
      label: 'Budget Items',
      description: 'Import or export detailed budget line items.',
    },
     {
      key: 'vendors',
      label: 'Vendors',
      description: 'Import or export the master vendor list.',
    },
     {
      key: 'team',
      label: 'Team',
      description: 'Import or export internal team member data.',
    },
    {
      key: 'budgetCategories',
      label: 'Budget Categories',
      description: 'Import or export the master list of budget categories.',
    },
    {
      key: 'tasks',
      label: 'Tasks',
      description: 'Import or export all tasks across all projects.',
    },
  ];

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import / Export</h1>
        <p className="text-muted-foreground">
          Manage your application data in bulk.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Select a data type to import from or export to an Excel file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dataTypes.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4"
            >
              <div className='mb-4 sm:mb-0'>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2">
                <Button
                  variant="outline"
                  className='w-1/2 sm:w-auto'
                  onClick={() => handleImportClick(key)}
                >
                  <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
                <Button variant="default" className='w-1/2 sm:w-auto' onClick={() => handleExport(key)}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
