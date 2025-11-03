

'use client'

import Link from 'next/link';
import Image from 'next/image';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppStateProvider } from '@/context/app-state-context';
import { vendors as initialVendors, teamMembers as initialTeamMembers, tasks as initialTasks, budgetCategories as initialBudgetCategories, projects as initialProjects, budgetItems as initialBudgetItems, expenses as initialExpenses, changeOrders as initialChangeOrders, rfis as initialRfis, issues as initialIssues, milestones as initialMilestones } from '@/lib/data';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone } from '@/lib/types';
import { AppStateContext } from '@/context/app-state-context';
import { useContext, useEffect, useState } from 'react';

function AppStateInitializer({ children }: { children: React.ReactNode }) {
    const [companyName, setCompanyName] = useState('FancyBuilders');
    const [companyLogoUrl, setCompanyLogoUrl] = useState('/your-logo.png');
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(initialBudgetCategories);
    const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(initialChangeOrders);
    const [rfis, setRfis] = useState<RFI[]>(initialRfis);
    const [issues, setIssues] = useState<Issue[]>(initialIssues);
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
    const [userName, setUserName] = useState('John Doe');
    const [userAvatarUrl, setUserAvatarUrl] = useState('https://i.pravatar.cc/150?u=john');
    const [userEmail, setUserEmail] = useState('john.doe@constructai.com');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedState = localStorage.getItem('appState');
            if (savedState) {
                const state = JSON.parse(savedState);
                setCompanyName(state.companyName || 'FancyBuilders');
                setCompanyLogoUrl(state.companyLogoUrl || '/your-logo.png');
                setProjects(state.projects || initialProjects);
                setBudgetCategories(state.budgetCategories || initialBudgetCategories);
                setVendors(state.vendors || initialVendors);
                setBudgetItems(state.budgetItems || initialBudgetItems);
                setTeamMembers(state.teamMembers || initialTeamMembers);
                setTasks(state.tasks || initialTasks);
                setExpenses(state.expenses || initialExpenses);
                setChangeOrders(state.changeOrders || initialChangeOrders);
                setRfis(state.rfis || initialRfis);
                setIssues(state.issues || initialIssues);
                setMilestones(state.milestones || initialMilestones);
                setUserName(state.userName || 'John Doe');
                setUserAvatarUrl(state.userAvatarUrl || 'https://i.pravatar.cc/150?u=john');
                setUserEmail(state.userEmail || 'john.doe@constructai.com');
            }
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const appState = {
                companyName, companyLogoUrl, projects, budgetCategories, vendors,
                budgetItems, teamMembers, tasks, expenses, changeOrders, rfis,
                issues, milestones, userName, userAvatarUrl, userEmail
            };
            localStorage.setItem('appState', JSON.stringify(appState));
        }
    }, [
        companyName, companyLogoUrl, projects, budgetCategories, vendors,
        budgetItems, teamMembers, tasks, expenses, changeOrders, rfis,
        issues, milestones, userName, userAvatarUrl, userEmail, isLoaded
    ]);

    if (!isLoaded) {
      return null; // Or a loading spinner
    }
    
    return (
        <AppStateProvider 
            initialState={{ 
                companyName, 
                companyLogoUrl, 
                projects, 
                budgetCategories, 
                vendors, 
                budgetItems, 
                teamMembers, 
                tasks, 
                expenses,
                changeOrders,
                rfis,
                issues,
                milestones,
                userName,
                userAvatarUrl,
                userEmail
            }}
            onStateChange={{ 
                setCompanyName, 
                setCompanyLogoUrl, 
                setProjects, 
                setBudgetCategories, 
                setVendors, 
                setBudgetItems, 
                setTeamMembers, 
                setTasks, 
                setExpenses,
                setChangeOrders,
                setRfis,
                setIssues,
                setMilestones,
                setUserName,
                setUserAvatarUrl,
                setUserEmail
            }}
        >
            {children}
        </AppStateProvider>
    );
}


function AppLayoutClient({ children }: { children: React.ReactNode }) {
    const appState = useContext(AppStateContext);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!appState || !hasMounted) {
        return null;
    }
    
    const { companyLogoUrl, companyName } = appState;

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-4">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        {companyLogoUrl ? (
                            <Image
                                src={companyLogoUrl}
                                alt={`${companyName} Logo`}
                                width={32}
                                height={32}
                                className="size-8 rounded-sm object-contain"
                            />
                        ) : (
                            <Logo className="size-8" />
                        )}
                        <span className="text-lg font-semibold">{companyName}</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <MainNav />
                </SidebarContent>
            </Sidebar>

            <SidebarInset className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden" />
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search projects..."
                                className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         <Button variant="ghost" size="icon" className="md:hidden">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppStateInitializer>
            <AppLayoutClient>{children}</AppLayoutClient>
        </AppStateInitializer>
    );
}

    