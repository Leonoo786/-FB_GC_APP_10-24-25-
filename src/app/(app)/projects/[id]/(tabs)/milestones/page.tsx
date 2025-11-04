import { MilestonesClientPage } from './milestones-client-page';

export default function ProjectMilestonesPage({
  params,
}: {
  params: { id: string };
}) {
  return <MilestonesClientPage projectId={params.id} />;
}
