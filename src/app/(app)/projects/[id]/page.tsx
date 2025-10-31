
import ProjectBudgetPage from './(tabs)/page';

// This remains a server component, so generateStaticParams is allowed.
export default function Page() {
  return <ProjectBudgetPage />;
}

export async function generateStaticParams() {
    // This is a placeholder. In a real app, you would fetch project IDs from a database.
    // The build will fail if there are no params, so we provide some defaults.
    return [{ id: 'proj-1' }, { id: 'proj-2' }, { id: 'proj-3' }, { id: 'proj-4' }];
}
