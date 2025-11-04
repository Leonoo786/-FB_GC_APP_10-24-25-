
'use client';

import { useContext } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import { BudgetClientPage } from './budget-client-page';

export default function ProjectBudgetPage({ params }: { params: { id: string } }) {
  const appState = useContext(AppStateContext);

  if (!appState) {
    return <div>Loading...</div>;
  }

  const { projects, budgetItems, expenses, budgetCategories } = appState;
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const projectBudgetItems = budgetItems.filter(item => item.projectId === project.id);
  const projectExpenses = expenses.filter(expense => expense.projectId === project.id);

  return (
    <BudgetClientPage
      project={project}
      initialBudgetItems={projectBudgetItems}
      initialExpenses={projectExpenses}
      budgetCategories={budgetCategories}
    />
  );
}
