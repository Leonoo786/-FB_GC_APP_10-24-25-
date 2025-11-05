

'use client'

import Link from 'next/link';
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
import { useEffect, useState } from 'react';


function AppLayoutClient({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return (
        <AppStateProvider>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader class="p-4">
                        <Link href="/dashboard" class="flex items-center gap-2">
                            <Logo class="size-8" />
                            <span class="text-lg font-semibold">ConstructAI</span>
                        </Link>
                    </SidebarHeader>
                    <SidebarContent>
                        <MainNav />
                    </SidebarContent>
                </Sidebar>

                <SidebarInset class="flex flex-col">
                    <header class="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
                        <div class="flex items-center gap-2">
                            <SidebarTrigger class="md:hidden" />
                            <div class="relative hidden md:block">
                                <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search projects..."
                                    class="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
                                />
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <Button variant="ghost" size="icon" class="md:hidden">
                                <Search class="h-5 w-5" />
                                <span class="sr-only">Search</span>
                            </Button>
                            <UserNav />
                        </div>
                    </header>
                    <main class="flex-1 overflow-auto p-4 sm:p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AppStateProvider>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppLayoutClient>{children}</AppLayoutClient>
    );
}
