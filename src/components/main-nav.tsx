"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  MessageCircle,
  Settings,
  AlertCircle,
  Tag,
  Truck,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const mainNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckCircle2 },
  { href: "/daily-reports", label: "Daily Reports", icon: ClipboardCheck },
  { href: "/issues", label: "Issues", icon: AlertCircle },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

const estimatingLinks = [
  { href: "/estimating/job-estimator", label: "AI Job Estimator", icon: Calculator },
  { href: "/estimating/budget-categories", label: "Budget Category", icon: Tag },
  { href: "/estimating/vendors", label: "Vendors", icon: Truck },
  { href: "/estimating/team", label: "Team", icon: Users },
];

export function MainNav() {
  const pathname = usePathname();

  const isEstimatingActive = estimatingLinks.some((link) =>
    pathname.startsWith(link.href)
  );

  return (
    <SidebarMenu>
      {mainNavLinks.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      <Collapsible defaultOpen={isEstimatingActive}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className="justify-between"
              isActive={isEstimatingActive}
            >
              <div className="flex items-center gap-2">
                <Calculator />
                <span>Estimating</span>
              </div>
              <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>
        <CollapsibleContent>
          <SidebarMenuSub>
            {estimatingLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname.startsWith(link.href)}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      
      <SidebarMenuItem className="mt-auto">
        <SidebarMenuButton
          asChild
          isActive={pathname === "/settings"}
          tooltip="Settings"
        >
          <Link href="/settings">
            <Settings />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
