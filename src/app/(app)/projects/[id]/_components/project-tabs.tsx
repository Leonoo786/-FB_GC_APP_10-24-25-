"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
    { name: "Overview", href: "" },
    { name: "Budget", href: "/budget" },
    { name: "Tasks", href: "/tasks" },
    { name: "Drawings", href: "/drawings" },
    { name: "RFIs", href: "/rfis" },
    { name: "Issues", href: "/issues" },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
    const pathname = usePathname();
    
    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => {
                    const href = `/projects/${projectId}${tab.href}`;
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={tab.name}
                            href={href}
                            className={cn(
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
