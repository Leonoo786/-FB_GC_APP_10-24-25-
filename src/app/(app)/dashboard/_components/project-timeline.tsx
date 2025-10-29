
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Project } from '@/lib/types';
import { differenceInDays, format, parseISO } from 'date-fns';

type ProjectTimelineProps = {
    projects: Project[];
};

export function ProjectTimeline({ projects }: ProjectTimelineProps) {
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        return d;
    });

    const getTimelineStyle = (project: Project) => {
        const startDate = parseISO(project.startDate);
        const endDate = parseISO(project.endDate);
        const timelineStart = months[0];
        
        const totalDuration = differenceInDays(endDate, startDate);
        const startOffsetDays = differenceInDays(startDate, timelineStart);
        const endOffsetDays = differenceInDays(endDate, timelineStart);
        
        // Approximate days in 6 months for percentage calculation
        const totalDisplayDays = 6 * 30.5; 
        
        const left = (startOffsetDays / totalDisplayDays) * 100;
        const width = (totalDuration / totalDisplayDays) * 100;

        return {
            left: `${Math.max(0, left)}%`,
            width: `${Math.min(100-Math.max(0,left), width)}%`,
        };
    };


    return (
        <div className="relative">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/4">Project</TableHead>
                        {months.map(month => (
                             <TableHead key={month.toISOString()} className="text-center">{format(month, 'MMM')}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                 <TableBody>
                    {projects.filter(p => p.status === 'In Progress').slice(0, 3).map(project => (
                        <TableRow key={project.id}>
                            <TableCell>
                                <div className="font-medium">{project.name}</div>
                                <div className="text-xs text-muted-foreground">{project.status}</div>
                            </TableCell>
                            <TableCell colSpan={6} className="relative p-0">
                                <div className="h-full py-2 px-2">
                                     <div 
                                        className="absolute h-4 bg-primary rounded-sm" 
                                        style={getTimelineStyle(project)}
                                        title={`${format(parseISO(project.startDate), 'MMM d')} - ${format(parseISO(project.endDate), 'MMM d')}`}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                 </TableBody>
            </Table>
             {projects.filter(p => p.status === 'In Progress').length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    No active projects to display on timeline.
                </div>
             )}
        </div>
    );
}

