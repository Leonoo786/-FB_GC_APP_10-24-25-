import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Upload, Download, Trash2 } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings, data, and application preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="John Doe" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="john.doe@constructai.com" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue="Project Manager" disabled />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                </CardFooter>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Import existing data or delete all current data.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Import Data</Label>
                        <Button variant="outline" disabled>
                            <Upload className="mr-2 h-4 w-4" /> Import from Excel
                        </Button>
                        <p className="text-xs text-muted-foreground">Import projects, budgets, and expenses from an Excel file.</p>
                    </div>
                     <div className="flex flex-col gap-2">
                        <Label>Delete Data</Label>
                        <Button variant="destructive" disabled>
                             <Trash2 className="mr-2 h-4 w-4" /> Delete All Data
                        </Button>
                        <p className="text-xs text-muted-foreground">Permanently delete all projects and associated data.</p>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
