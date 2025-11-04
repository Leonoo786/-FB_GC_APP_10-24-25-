import { ClientUploadsClientPage } from './client-uploads-client-page';

export default function ProjectClientUploadsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ClientUploadsClientPage projectId={params.id} />;
}
