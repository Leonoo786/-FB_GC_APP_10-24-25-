
import { Suspense } from 'react';
import { projects as initialProjects } from '@/lib/data';
import { ProjectDetailLayoutClient } from './_components/project-detail-layout-client';

// This is the parent Server Component.
export default function ProjectDetailLayout({
    params,
    children,
}: {
    params: { id: string };
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div>Loading project details...</div>}>
            <ProjectDetailLayoutClient params={params}>
                {children}
            </ProjectDetailLayoutClient>
        </Suspense>
    )
}
