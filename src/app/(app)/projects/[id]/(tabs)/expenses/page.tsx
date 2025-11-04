
// This is a server component
import { ExpensesClientPage } from './expenses-client-page';

export default function ProjectExpensesPage({
  params,
}: {
  params: { id: string };
}) {

  return (
    <ExpensesClientPage
      projectId={params.id}
    />
  );
}
