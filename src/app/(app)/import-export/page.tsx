
'use client';

import { useContext, useRef, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppStateContext, useAppState } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, HardDrive, Database, BookOpen, PenSquare, Trash2, Loader2 } from 'lucide-react';
import type {
  Project,
  BudgetItem,
  Expense,
  Vendor,
  TeamMember,
  BudgetCategory,
  Task,
  ChangeOrder,
  RFI,
  Issue,
  Milestone,
} from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFirebase } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';


type AllData = {
  projects: Project[];
  vendors: Vendor[];
  teamMembers: TeamMember[];
  budgetCategories: BudgetCategory[];
  tasks: Task[];
  budgetItems: BudgetItem[];
  expenses: Expense[];
  changeOrders: ChangeOrder[];
  rfis: RFI[];
  issues: Issue[];
  milestones: Milestone[];
  companyName: string;
  companyLogoUrl: string;
  userName: string;
  userAvatarUrl: string;
  userEmail: string;
};

const ONE_GIB_IN_BYTES = 1 * 1024 * 1024 * 1024;

export default function ImportExportPage() {
  const appState = useAppState();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { firestore, user } = useFirebase();
  const [isMigrating, setIsMigrating] = useState(false);

  const {
    projects,
    vendors,
    teamMembers,
    budgetCategories,
    tasks,
    budgetItems,
    expenses,
    changeOrders,
    rfis,
    issues,
    milestones,
    companyName,
    companyLogoUrl,
    userName,
    userAvatarUrl,
    userEmail,
    setProjects,
    setVendors,
    setTeamMembers,
    setBudgetCategories,
    setTasks,
    setBudgetItems,
    setExpenses,
    setChangeOrders,
    setRfis,
    setIssues,
    setMilestones,
    setCompanyName,
    setCompanyLogoUrl,
    setUserName,
    setUserAvatarUrl,
    setUserEmail,
  } = appState;
  
  const allData: AllData = {
    projects,
    vendors,
    teamMembers,
    budgetCategories,
    tasks,
    budgetItems,
    expenses,
    changeOrders,
    rfis,
    issues,
    milestones,
    companyName,
    companyLogoUrl,
    userName,
    userAvatarUrl,
    userEmail,
  };
  
  const { sizeInBytes, displaySize } = useMemo(() => {
    try {
      const jsonString = JSON.stringify(allData);
      const bytes = new Blob([jsonString]).size;
      let sizeLabel: string;
      if (bytes < 1024) {
        sizeLabel = `${bytes.toFixed(2)} Bytes`;
      } else if (bytes < 1024 * 1024) {
        sizeLabel = `${(bytes / 1024).toFixed(2)} KB`;
      } else if (bytes < 1024 * 1024 * 1024){
        sizeLabel = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      } else {
        sizeLabel = `${(bytes / ONE_GIB_IN_BYTES).toFixed(2)} GB`;
      }
      return { sizeInBytes: bytes, displaySize: sizeLabel };
    } catch {
      return { sizeInBytes: 0, displaySize: "N/A" };
    }
  }, [allData]);

  const storageUsagePercentage = (sizeInBytes / ONE_GIB_IN_BYTES) * 100;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data: AllData = JSON.parse(text);

        setProjects(data.projects || []);
        setVendors(data.vendors || []);
        setTeamMembers(data.teamMembers || []);
        setBudgetCategories(data.budgetCategories || []);
        setTasks(data.tasks || []);
        setBudgetItems(data.budgetItems || []);
        setExpenses(data.expenses || []);
        setChangeOrders(data.changeOrders || []);
        setRfis(data.rfis || []);
        setIssues(data.issues || []);
        setMilestones(data.milestones || []);
        setCompanyName(data.companyName || 'FancyBuilders');
        setCompanyLogoUrl(data.companyLogoUrl || '/your-logo.png');
        setUserName(data.userName || 'John Doe');
        setUserAvatarUrl(data.userAvatarUrl || 'https://i.pravatar.cc/150?u=john');
        setUserEmail(data.userEmail || 'john.doe@constructai.com');

        toast({
          title: 'Import Successful',
          description: 'All application data has been restored from your file.',
        });
      } catch (error) {
        console.error('Error importing data:', error);
        toast({
          title: 'Import Failed',
          description:
            'There was an error processing the file. Please ensure it is a valid JSON backup file.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    try {
      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `constructai-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Successful',
        description: 'All application data has been downloaded.',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'An unexpected error occurred during the export.',
        variant: 'destructive',
      });
    }
  };

  const handleMigrate = async () => {
    if (!firestore || !user) {
      toast({
        title: 'Migration Failed',
        description: 'You must be logged in to migrate data.',
        variant: 'destructive',
      });
      return;
    }

    setIsMigrating(true);
    toast({
      title: 'Migration Started',
      description: 'Copying your local data to Firebase. Please wait...',
    });

    try {
      const batch = writeBatch(firestore);

      // User-specific data
      const userDocRef = doc(firestore, 'users', user.uid);
      batch.set(userDocRef, {
        companyName,
        companyLogoUrl,
        userName,
        userAvatarUrl,
        userEmail,
      });

      // Collections
      projects.forEach(item => batch.set(doc(firestore, `users/${user.uid}/projects`, item.id), item));
      vendors.forEach(item => batch.set(doc(firestore, `users/${user.uid}/vendors`, item.id), item));
      teamMembers.forEach(item => batch.set(doc(firestore, `users/${user.uid}/teamMembers`, item.id), item));
      budgetCategories.forEach(item => batch.set(doc(firestore, `users/${user.uid}/budgetCategories`, item.id), item));
      tasks.forEach(item => batch.set(doc(firestore, `users/${user.uid}/tasks`, item.id), item));
      budgetItems.forEach(item => batch.set(doc(firestore, `users/${user.uid}/budgetItems`, item.id), item));
      expenses.forEach(item => batch.set(doc(firestore, `users/${user.uid}/expenses`, item.id), item));
      changeOrders.forEach(item => batch.set(doc(firestore, `users/${user.uid}/changeOrders`, item.id), item));
      rfis.forEach(item => batch.set(doc(firestore, `users/${user.uid}/rfis`, item.id), item));
      issues.forEach(item => batch.set(doc(firestore, `users/${user.uid}/issues`, item.id), item));
      milestones.forEach(item => batch.set(doc(firestore, `users/${user.uid}/milestones`, item.id), item));

      await batch.commit();

      toast({
        title: 'Migration Successful!',
        description: 'All your data has been copied to Firebase.',
      });

    } catch (error) {
      console.error('Firebase migration error:', error);
      toast({
        title: 'Migration Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".json"
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import / Export</h1>
        <p className="text-muted-foreground">
          Manage your application data in bulk and monitor storage usage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Download a backup file, restore from a backup, or migrate to the cloud.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4"
            >
              <div className='mb-4 sm:mb-0'>
                <p className="font-medium">Local Backup & Restore</p>
                <p className="text-sm text-muted-foreground">
                  Save or load a snapshot of your application data to/from a file.
                </p>
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2">
                <Button
                  variant="outline"
                  className='w-1/2 sm:w-auto'
                  onClick={handleImportClick}
                >
                  <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
                <Button variant="default" className='w-1/2 sm:w-auto' onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cloud Migration</CardTitle>
                    <CardDescription>Copy your current local data to your Firebase account to enable cross-device access and real-time collaboration.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <Database className="h-4 w-4" />
                        <AlertTitle>One-Way Copy</AlertTitle>
                        <AlertDescription>
                            This will copy your current local data to the cloud. It will not delete your local data. If you have existing data in the cloud, it may be overwritten.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleMigrate} disabled={isMigrating}>
                        {isMigrating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Migrate Data to Firebase
                    </Button>
                </CardFooter>
            </Card>


             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <HardDrive className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <CardTitle>Current Data Size</CardTitle>
                        <CardDescription>The total size of your data stored in the browser relative to Firestore's 1 GiB free tier.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{displaySize}</p>
                    <Progress value={storageUsagePercentage} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      You've used {storageUsagePercentage.toFixed(4)}% of the 1 GiB free limit.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Document Reads</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                        of 50,000 per day (free tier)
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Document Writes</CardTitle>
                        <PenSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                        of 20,000 per day (free tier)
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Document Deletes</CardTitle>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                        of 20,000 per day (free tier)
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Note on Usage Metrics</AlertTitle>
              <AlertDescription>
                The read, write, and delete counts are currently zero because the application is using local browser storage. Migrating to Firebase Firestore would enable these real-time metrics.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
