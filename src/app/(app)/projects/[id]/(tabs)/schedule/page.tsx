import { ScheduleClientPage } from './schedule-client-page';

export default function ProjectSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  return <ScheduleClientPage projectId={params.id} />;
}
