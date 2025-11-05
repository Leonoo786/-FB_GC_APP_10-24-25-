

'use client';

import { useState, useContext, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, MoreHorizontal, User, Laptop, Smartphone, TriangleAlert, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { AppStateContext } from "@/context/app-state-context";


const notificationItems = [
    { id: 'task-assignments', label: 'Task assignments and updates' },
    { id: 'project-milestones', label: 'Project milestones' },
    { id: 'document-uploads', label: 'Document uploads and updates' },
    { id: 'comments-mentions', label: 'Comments and mentions' },
    { id: 'budget-approvals', label: 'Budget approvals and changes' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const appState = useContext(AppStateContext);

  // Profile State
  const [photoUrl, setPhotoUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [jobTitle, setJobTitle] = useState("Admin");
  const [department, setDepartment] = useState("Construction");
  const [bio, setBio] = useState("");

  // Company State - Initialize from context but allow local edits
  const [companyName, setCompanyName] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [industry, setIndustry] = useState("Construction");
  const [companySize, setCompanySize] = useState("51-200");
  const [address, setAddress] = useState("123 Construction Avenue");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("NY");
  const [zipCode, setZipCode] = useState("10001");
  const [companyPhone, setCompanyPhone] = useState("(555) 987-6543");
  const [companyWebsite, setCompanyWebsite] = useState("https://www.fancybuilders.com");

  useEffect(() => {
    if (appState) {
        setName(appState.userName);
        setPhotoUrl(appState.userAvatarUrl);
        setEmail(appState.userEmail);
        setCompanyName(appState.companyName);
        setCompanyLogoUrl(appState.companyLogoUrl);
    }
  }, [appState]);

  if (!appState) {
    return <div>Loading...</div>
  }

  const {
      userName,
      setUserName,
      setUserAvatarUrl,
      userEmail,
      setUserEmail,
      setCompanyName: setGlobalCompanyName,
      setCompanyLogoUrl: setGlobalCompanyLogoUrl,
  } = appState;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCompanyLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setUserName(name);
    setUserAvatarUrl(photoUrl);
    setUserEmail(email);
    toast({
      title: "Changes Saved",
      description: "Your profile information has been updated.",
    });
  };
  
  const handleCompanySaveChanges = () => {
    setGlobalCompanyName(companyName);
    setGlobalCompanyLogoUrl(companyLogoUrl);
    toast({
      title: "Changes Saved",
      description: "Your company information has been updated.",
    });
  };

  const nameParts = name.split(' ');
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(' ') || "";

  const handleNameChange = (part: 'first' | 'last', value: string) => {
    if (part === 'first') {
        setName(`${value} ${lastName}`);
    } else {
        setName(`${firstName} ${value}`);
    }
  };


  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
        <p class="text-muted-foreground">Welcome back, {userName.split(' ')[0]}</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" class="mt-6">
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              <div class="flex flex-col md:flex-row gap-8">
                <div class="flex flex-col items-center gap-4 md:w-1/4">
                  <Avatar class="h-32 w-32">
                    <AvatarImage src={photoUrl} />
                    <AvatarFallback>
                        <User class="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  <Input id="photo-upload" type="file" class="hidden" onChange={handlePhotoChange} accept="image/*" />
                  <Button variant="outline" asChild>
                    <Label htmlFor="photo-upload" class="cursor-pointer">Change Photo</Label>
                  </Button>
                </div>
                <div class="flex-1 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => handleNameChange('first', e.target.value)} />
                    </div>
                    <div class="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => handleNameChange('last', e.target.value)} />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div class="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                   <div class="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  </div>
                  <div class="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div class="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="A brief description about yourself"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter class="border-t px-6 py-4 justify-end">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account" class="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <Label>Language</Label>
                    <p class="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger class="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label>Time Zone</Label>
                    <p class="text-sm text-muted-foreground">Set your local time zone</p>
                  </div>
                  <Select defaultValue="est">
                    <SelectTrigger class="w-[180px]">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">America/New_York (EST)</SelectItem>
                      <SelectItem value="cst">America/Chicago (CST)</SelectItem>
                      <SelectItem value="mst">America/Denver (MST)</SelectItem>
                      <SelectItem value="pst">America/Los_Angeles (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label>Date Format</Label>
                    <p class="text-sm text-muted-foreground">Choose how dates are displayed</p>
                  </div>
                   <Select defaultValue="mmddyyyy">
                    <SelectTrigger class="w-[180px]">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div class="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p class="text-sm text-muted-foreground">Choose your interface theme</p>
                  </div>
                   <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger class="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter class="border-t px-6 py-4 justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
        </TabsContent>
         <TabsContent value="notifications" class="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent class="space-y-8">
                    <div>
                        <h3 class="mb-4 text-lg font-medium">Email Notifications</h3>
                        <div class="space-y-4">
                            {notificationItems.map((item) => (
                                <div key={`email-${item.id}`} class="flex items-center justify-between rounded-lg border p-4">
                                    <Label htmlFor={`email-${item.id}`}>{item.label}</Label>
                                    <Switch id={`email-${item.id}`} defaultChecked />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 class="mb-4 text-lg font-medium">In-App Notifications</h3>
                        <div class="space-y-4">
                             {notificationItems.map((item) => (
                                <div key={`in-app-${item.id}`} class="flex items-center justify-between rounded-lg border p-4">
                                    <Label htmlFor={`in-app-${item.id}`}>{item.label}</Label>
                                    <Switch id={`in-app-${item.id}`} defaultChecked />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Separator />

                    <div>
                         <h3 class="mb-4 text-lg font-medium">Frequency</h3>
                         <div class="flex items-center justify-between rounded-lg border p-4">
                            <Label>Email digest frequency</Label>
                             <Select defaultValue="daily">
                                <SelectTrigger class="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="never">Never</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                    </div>

                </CardContent>
                 <CardFooter class="border-t px-6 py-4 justify-end">
                    <Button>Save Notification Settings</Button>
                </CardFooter>
             </Card>
        </TabsContent>
         <TabsContent value="company" class="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company details and preferences</CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <div class="space-y-2">
                  <Label>Company Logo</Label>
                  <div class="flex items-center gap-4">
                    <Avatar class="h-20 w-20 rounded-md">
                        <AvatarImage src={companyLogoUrl} />
                        <AvatarFallback>
                            <User class="h-10 w-10" />
                        </AvatarFallback>
                    </Avatar>
                    <Input id="logo-upload" type="file" class="hidden" accept="image/*" onChange={handleLogoChange} />
                    <Button variant="outline" asChild>
                        <Label htmlFor="logo-upload" class="cursor-pointer">Change Logo</Label>
                    </Button>
                  </div>
                </div>
                <div class="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                    </div>
                    <div class="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                            <SelectTrigger id="companySize">
                                <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="space-y-2 col-span-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div class="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                    <div class="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                </div>
                <div class="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input id="companyPhone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
                <div class="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input id="companyWebsite" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter class="border-t px-6 py-4 justify-end">
                <Button onClick={handleCompanySaveChanges}>Save Company Information</Button>
              </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="security" class="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and account security</CardDescription>
                </CardHeader>
                <CardContent class="space-y-8">
                    <div>
                        <h3 class="font-medium text-lg mb-4">Change Password</h3>
                        <div class="space-y-4">
                            <div class="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div class="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div class="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                        </div>
                    </div>
                     <CardFooter class="px-0 pb-0 justify-start">
                        <Button>Update Password</Button>
                    </CardFooter>
                </CardContent>

                <Separator />

                <CardContent class="space-y-8 pt-6">
                   <div class="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <h3 class="font-medium">Two-Factor Authentication</h3>
                            <p class="text-sm text-muted-foreground">
                                Add an extra layer of security to your account.
                            </p>
                        </div>
                        <Switch id="two-factor" />
                    </div>
                </CardContent>
                
                 <Separator />

                <CardContent class="space-y-4 pt-6">
                    <h3 class="font-medium text-lg">Session Management</h3>
                    <p class="text-sm text-muted-foreground">You're currently signed in on these devices:</p>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between rounded-lg border p-4">
                            <div class="flex items-center gap-4">
                                <Laptop class="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p class="font-medium">Windows PC - Chrome</p>
                                    <p class="text-sm text-muted-foreground">New York, USA • Current session</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal class="h-5 w-5" />
                                <span class="sr-only">Session options</span>
                            </Button>
                        </div>
                         <div class="flex items-center justify-between rounded-lg border p-4">
                            <div class="flex items-center gap-4">
                                <Smartphone class="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p class="font-medium">iPhone 13 - Safari</p>
                                    <p class="text-sm text-muted-foreground">New York, USA • Last active: 2 hours ago</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal class="h-5 w-5" />
                                <span class="sr-only">Session options</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter class="border-t px-6 py-4">
                    <Button variant="outline">
                        <LogOut class="mr-2" />
                        Sign out of all devices
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="advanced" class="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>
                        System administration and data management options
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-8">
                    <div>
                        <h3 class="font-medium text-lg mb-4">Data Management</h3>
                        <Alert variant="destructive">
                            <TriangleAlert class="h-4 w-4" />
                            <AlertTitle>Reset Project Data</AlertTitle>
                            <AlertDescription>
                                <div class="flex justify-between items-center">
                                    <p>
                                        This action will permanently delete all project data including budgets, tasks, documents, and photos. User accounts will be preserved.
                                    </p>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Reset All Project Data</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete all project data from our servers.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div>
                        <h3 class="font-medium text-lg mb-2">Data Export</h3>
                        <Card>
                            <CardContent class="flex flex-col items-center justify-center p-6 space-y-4">
                               <p class="text-sm text-muted-foreground">Export all your project data for backup or transfer purposes.</p>
                               <Button variant="outline">
                                    <Download class="mr-2 h-4 w-4" />
                                    Export All Data
                                 </Button>
                            </CardContent>
                        </Card>
                    </div>

                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
