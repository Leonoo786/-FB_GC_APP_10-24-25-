
import { projects as initialProjects } from '@/lib/data';
import ProjectBudgetPage from './(tabs)/page';

// This remains a server component, so generateStaticParams is allowed here.
export default function Page() {
  return <ProjectBudgetPage />;
}

export async function generateStaticParams() {
  return initialProjects.map((project) => ({
    id: project.id,
  }));
}
