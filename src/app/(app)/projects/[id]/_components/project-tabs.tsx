

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
    { name: "Reports", href: "reports" },
    { name: "Budget", href: "" },
    { name: "Expenses", href: "expenses" },
    { name: "Change Orders", href: "change-orders" },
    { name: "Get Reimbursed", href: "get-reimbursed" },
    { name: "Milestones", href: "milestones" },
    { name: "Drawings", href: "drawings" },
    { name: "Schedule", href: "schedule" },
    { name: "RFIs", href: "rfis" },
    { name: "Client Uploads", href: "client-uploads" },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
    const pathname = usePathname();
    const baseHref = `/projects/${projectId}`;
    
    return (
        <div class="border-b">
            <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const href = tab.href ? `${baseHref}/${tab.href}` : baseHref;
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={tab.name}
                            href={href}
                            class={cn(
                                "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
                                isActive
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
