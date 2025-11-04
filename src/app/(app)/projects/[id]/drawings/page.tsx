import { DrawingsClientPage } from './drawings-client-page';

export default function ProjectDrawingsPage({
  params,
}: {
  params: { id: string };
}) {
  return <DrawingsClientPage projectId={params.id} />;
}
