// This is a server component
import { ReportsClientPage } from './reports-client-page';

export default function ProjectReportsPage({
  params,
}: {
  params: { id: string };
}) {

  return (
    <ReportsClientPage
      projectId={params.id}
    />
  );
}
