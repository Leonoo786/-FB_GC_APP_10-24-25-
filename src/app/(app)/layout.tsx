

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
import { useLocalStorage } from '@/hooks/use-local-storage';


function AppStateInitializer({ children }: { children: React.ReactNode }) {
    const [companyName, setCompanyName] = useLocalStorage('companyName', 'FancyBuilders');
    const [companyLogoUrl, setCompanyLogoUrl] = useLocalStorage('companyLogoUrl', '/your-logo.png');
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', initialProjects);
    const [budgetCategories, setBudgetCategories] = useLocalStorage<BudgetCategory[]>('budgetCategories', initialBudgetCategories);
    const [vendors, setVendors] = useLocalStorage<Vendor[]>('vendors', initialVendors);
    const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>('budgetItems', initialBudgetItems);
    const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', initialTeamMembers);
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', initialExpenses);
    const [changeOrders, setChangeOrders] = useLocalStorage<ChangeOrder[]>('changeOrders', initialChangeOrders);
    const [rfis, setRfis] = useLocalStorage<RFI[]>('rfis', initialRfis);
    const [issues, setIssues] = useLocalStorage<Issue[]>('issues', initialIssues);
    const [milestones, setMilestones] = useLocalStorage<Milestone[]>('milestones', initialMilestones);
    const [userName, setUserName] = useLocalStorage('userName', 'John Doe');
    const [userAvatarUrl, setUserAvatarUrl] = useLocalStorage('userAvatarUrl', 'https://i.pravatar.cc/150?u=john');
    const [userEmail, setUserEmail] = useLocalStorage('userEmail', 'john.doe@constructai.com');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return null;
    }

    const stateAndSetters = {
        companyName, setCompanyName,
        companyLogoUrl, setCompanyLogoUrl,
        projects, setProjects,
        budgetCategories, setBudgetCategories,
        vendors, setVendors,
        budgetItems, setBudgetItems,
        teamMembers, setTeamMembers,
        tasks, setTasks,
        expenses, setExpenses,
        changeOrders, setChangeOrders,
        rfis, setRfis,
        issues, setIssues,
        milestones, setMilestones,
        userName, setUserName,
        userAvatarUrl, setUserAvatarUrl,
        userEmail, setUserEmail
    };

    return (
        <AppStateProvider 
            initialState={{...stateAndSetters}}
            onStateChange={{
                setCompanyName, setCompanyLogoUrl, setProjects, setBudgetCategories, setVendors, 
                setBudgetItems, setTeamMembers, setTasks, setExpenses, setChangeOrders, 
                setRfis, setIssues, setMilestones, setUserName, setUserAvatarUrl, setUserEmail
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
