
import { useContext } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import { ExpensesClientPage } from './expenses-client-page';

export default function ProjectExpensesPage({
  params,
}: {
  params: { id: string };
}) {
  const appState = useContext(AppStateContext);

  if (!appState) {
    return <div>Loading...</div>;
  }
  const { expenses, budgetCategories } = appState;
  const projectExpenses = expenses.filter((exp) => exp.projectId === params.id);

  return (
    <ExpensesClientPage
      projectId={params.id}
      initialExpenses={projectExpenses}
      budgetCategories={budgetCategories}
    />
  );
}
