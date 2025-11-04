
'use client';

import { useContext, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { AppStateContext } from '@/context/app-state-context';
import { ReportsClientPage } from './reports-client-page';

export default function ProjectReportsPage({
  params,
}: {
  params: { id: string };
}) {
  const appState = useContext(AppStateContext);
  
  const project = appState?.projects.find((p) => p.id === params.id);

  if (!project || !appState) {
    // We can't use notFound() in a client component that's not at the root of a route segment
    // so we return null and let the parent layout handle it if needed.
    return null;
  }
  
  const projectBudgetItems = appState.budgetItems.filter((item) => item.projectId === params.id);
  const projectExpenses = appState.expenses.filter((expense) => expense.projectId === params.id);

  return <ReportsClientPage 
    projectBudgetItems={projectBudgetItems}
    projectExpenses={projectExpenses}
  />;
}
