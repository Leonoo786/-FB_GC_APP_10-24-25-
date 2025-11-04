
import React from 'react';
import ProjectDetailLayoutClient from './project-detail-layout';

// This is the new Server Component Layout
export default async function ProjectDetailLayout({
  params: paramsPromise,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await paramsPromise;

  return (
    <ProjectDetailLayoutClient projectId={params.id}>
      {children}
    </ProjectDetailLayoutClient>
  );
}
