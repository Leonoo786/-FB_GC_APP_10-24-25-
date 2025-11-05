
'use client';

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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/context/app-state-context';
import { useAuth, useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';


function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const appState = useAppState();
    const auth = useAuth();
    const { user, isUserLoading } = useUser();

    useEffect(() => {
        if (auth && !user && !isUserLoading) {
            initiateAnonymousSignIn(auth);
        }
    }, [auth, user, isUserLoading]);

    if (appState.isLoading) {
        return <div className="flex h-screen w-screen items-center justify-center">Loading application data...</div>;
    }
    
    const { companyName, companyLogoUrl } = appState;

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-4">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        {companyLogoUrl ? (
                          <Image src={companyLogoUrl} alt={`${companyName} Logo`} width={32} height={32} className="rounded-sm" />
                        ) : (
                          <div className="h-8 w-8 rounded-sm bg-muted" />
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

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <AppLayoutContent>{children}</AppLayoutContent>
    );
}
