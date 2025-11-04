import { ChangeOrdersClientPage } from './change-orders-client-page';

export default function ProjectChangeOrdersPage({
  params,
}: {
  params: { id: string };
}) {
  return <ChangeOrdersClientPage projectId={params.id} />;
}
