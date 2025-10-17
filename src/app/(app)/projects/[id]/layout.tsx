import { projects, teamMembers } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import { ProjectTabs } from "./_components/project-tabs";

export default function ProjectDetailLayout({
    params,
    children,
}: {
    params: { id: string };
    children: React.ReactNode;
}) {
    const project = projects.find(p => p.id === params.id);
    if (!project) {
        notFound();
    }

    const projectManager = teamMembers.find(tm => tm.role === 'Project Manager');

    return (
        <div className="flex flex-col gap-6">
            <div>
                 <Button variant="ghost" asChild className="mb-4">
                    <Link href="/projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Link>
                </Button>

                <div className="relative h-64 w-full rounded-lg bg-secondary">
                    <Image src={project.imageUrl} alt={project.name} fill className="object-cover rounded-lg" data-ai-hint={project.imageHint}/>
                </div>

                <div className="mt-[-4rem] flex flex-col items-start gap-4 px-6 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] sm:text-4xl">
                            {project.name}
                        </h1>
                        <p className="text-sm text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                            {project.addressStreet}, {project.city}, {project.zip}
                        </p>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-lg mb-2">Project Details</h3>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span className="font-medium text-foreground">Project #</span>
                            <span>{project.projectNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-foreground">Status</span>
                            <span>{project.status}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="font-medium text-foreground">Owner</span>
                            <span>{project.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-foreground">Start Date</span>
                            <span>{project.startDate}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="font-medium text-foreground">End Date</span>
                            <span>{project.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-foreground">Contract</span>
                            <span>${project.revisedContract.toLocaleString()}</span>
                        </div>
                        <Separator />
                         <div className="space-y-2">
                             <span className="font-medium text-foreground">Project Manager</span>
                            {projectManager && (
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={projectManager.avatarUrl} />
                                        <AvatarFallback>{projectManager.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{projectManager.name}</p>
                                        <p className="text-xs">{projectManager.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <ProjectTabs projectId={project.id} />
                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
