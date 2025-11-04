import { RfisClientPage } from './rfis-client-page';

export default function ProjectRFIsPage({ params }: { params: { id: string } }) {
  return <RfisClientPage projectId={params.id} />;
}
