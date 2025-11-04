
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

  const projectBudgetItems = useMemo(() => 
    appState?.budgetItems.filter((item) => item.projectId === params.id) || [],
    [appState?.budgetItems, params.id]
  );
  
  const projectExpenses = useMemo(() =>
    appState?.expenses.filter((expense) => expense.projectId === params.id) || [],
    [appState?.expenses, params.id]
  );

  if (!project || !appState) {
    notFound();
  }

  return (
    <ReportsClientPage 
      projectBudgetItems={projectBudgetItems}
      projectExpenses={projectExpenses}
    />
  );
}
