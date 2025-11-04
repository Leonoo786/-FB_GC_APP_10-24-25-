
import { ProjectDetailLayout } from './project-detail-layout';

export default function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  return (
    <ProjectDetailLayout projectId={params.id}>
        {children}
    </ProjectDetailLayout>
  );
}
