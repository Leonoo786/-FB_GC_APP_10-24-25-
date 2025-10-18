'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { name: 'Budget', href: '' },
  { name: 'Expenses', href: '/expenses' },
  { name: 'Change Orders', href: '/change-orders' },
  { name: 'Drawings', href: '/drawings' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'RFIs', href: '/rfis' },
  { name: 'Reports', href: '/reports' },
  { name: 'Client Uploads', href: '/client-uploads' },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const baseHref = `/projects/${projectId}`;
          const href = tab.href ? `${baseHref}${tab.href}` : baseHref;
          
          // The budget tab is the default, so it's active if the path is just the project ID.
          // Other tabs are active if the path ends with their specific href.
          const isActive = tab.href === '' ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={tab.name}
              href={href}
              className={cn(
                'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
