
// This is a server component
import { GetReimbursedClientPage } from './get-reimbursed-client-page';

export default function ProjectGetReimbursedPage({
  params,
}: {
  params: { id: string };
}) {

  return (
    <GetReimbursedClientPage
      projectId={params.id}
    />
  );
}
