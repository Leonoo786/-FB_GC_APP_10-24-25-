
'use client';

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
import { MoreHorizontal, User } from "lucide-react";
import { useTheme } from "next-themes";

const notificationItems = [
    { id: 'task-assignments', label: 'Task assignments and updates' },
    { id: 'project-milestones', label: 'Project milestones' },
    { id: 'document-uploads', label: 'Document uploads and updates' },
    { id: 'comments-mentions', label: 'Comments and mentions' },
    { id: 'budget-approvals', label: 'Budget approvals and changes' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Welcome back, Guest</p>
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
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4 md:w-1/4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                        <User className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Guest" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="User" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex.rodriguez@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="(555) 123-4567" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" defaultValue="Admin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select defaultValue="construction">
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="estimating">Estimating</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                         <SelectItem value="hr">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="A brief description about yourself"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 justify-end">
                <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Time Zone</Label>
                    <p className="text-sm text-muted-foreground">Set your local time zone</p>
                  </div>
                  <Select defaultValue="est">
                    <SelectTrigger className="w-[180px]">
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Date Format</Label>
                    <p className="text-sm text-muted-foreground">Choose how dates are displayed</p>
                  </div>
                   <Select defaultValue="mmddyyyy">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your interface theme</p>
                  </div>
                   <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]">
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
              <CardFooter className="border-t px-6 py-4 justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
        </TabsContent>
         <TabsContent value="notifications" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                        <div className="space-y-4">
                            {notificationItems.map((item) => (
                                <div key={`email-${item.id}`} className="flex items-center justify-between rounded-lg border p-4">
                                    <Label htmlFor={`email-${item.id}`}>{item.label}</Label>
                                    <Switch id={`email-${item.id}`} defaultChecked />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="mb-4 text-lg font-medium">In-App Notifications</h3>
                        <div className="space-y-4">
                             {notificationItems.map((item) => (
                                <div key={`in-app-${item.id}`} className="flex items-center justify-between rounded-lg border p-4">
                                    <Label htmlFor={`in-app-${item.id}`}>{item.label}</Label>
                                    <Switch id={`in-app-${item.id}`} defaultChecked />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Separator />

                    <div>
                         <h3 className="mb-4 text-lg font-medium">Frequency</h3>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <Label>Email digest frequency</Label>
                             <Select defaultValue="daily">
                                <SelectTrigger className="w-[180px]">
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
                 <CardFooter className="border-t px-6 py-4 justify-end">
                    <Button>Save Notification Settings</Button>
                </CardFooter>
             </Card>
        </TabsContent>
         <TabsContent value="company" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="FancyBuilders Construction" className="pr-10"/>
                  <Button variant="ghost" size="icon" className="absolute right-1 top-6 h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" defaultValue="Construction" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select defaultValue="51-200">
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
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Construction Avenue" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="New York" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" defaultValue="NY" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" defaultValue="10001" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input id="companyPhone" defaultValue="(555) 987-6543" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input id="companyWebsite" defaultValue="https://www.fancybuilders.com" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 justify-end">
                <Button>Save Company Information</Button>
              </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="security">
            <p className="text-muted-foreground">Security settings will be displayed here.</p>
        </TabsContent>
        <TabsContent value="advanced">
            <p className="text-muted-foreground">Advanced settings will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
