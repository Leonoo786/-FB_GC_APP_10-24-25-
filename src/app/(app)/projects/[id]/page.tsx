import ProjectBudgetPage from './(tabs)/page';
import { projects as initialProjects } from '@/lib/data';

export async function generateStaticParams() {
  return initialProjects.map((project) => ({
    id: project.id,
  }));
}

// This remains a server component, so generateStaticParams is allowed here.
export default function Page() {
  return <ProjectBudgetPage />;
}
