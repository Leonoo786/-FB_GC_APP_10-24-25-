

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
        d.setDate(1); // Start from the first day of the month
        d.setMonth(d.getMonth() + i);
        return d;
    });

    const timelineStart = months[0];
    const timelineEnd = new Date(months[5].getFullYear(), months[5].getMonth() + 1, 0); // End of the last month
    const totalDisplayDays = differenceInDays(timelineEnd, timelineStart);

    const getTimelineStyle = (project: Project) => {
        const startDate = parseISO(project.startDate);
        const endDate = parseISO(project.endDate);
        
        const startOffsetDays = differenceInDays(startDate, timelineStart);
        const endOffsetDays = differenceInDays(endDate, timelineStart);
        
        const left = (startOffsetDays / totalDisplayDays) * 100;
        const width = ((endOffsetDays - startOffsetDays) / totalDisplayDays) * 100;

        return {
            left: `${Math.max(0, left)}%`,
            width: `${Math.min(100 - Math.max(0, left), width)}%`,
        };
    };

    const activeProjects = projects.filter(p => p.status === 'In Progress');

    return (
        <div className="relative">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/4">Project</TableHead>
                        {months.map(month => (
                             <TableHead key={month.toISOString()} className="text-center">{format(month, 'MMM yyyy')}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                 <TableBody>
                    {activeProjects.slice(0, 5).map(project => (
                        <TableRow key={project.id}>
                            <TableCell>
                                <div className="font-medium">{project.name}</div>
                                <div className="text-xs text-muted-foreground">{project.status}</div>
                            </TableCell>
                            <TableCell colSpan={6} className="relative p-0 h-12">
                                <div className="h-full py-2 px-2">
                                     <div 
                                        className="absolute h-4 bg-primary rounded-sm top-1/2 -translate-y-1/2" 
                                        style={getTimelineStyle(project)}
                                        title={`${project.name}: ${format(parseISO(project.startDate), 'MMM d')} - ${format(parseISO(project.endDate), 'MMM d')}`}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                 </TableBody>
            </Table>
             {activeProjects.length === 0 && (
                <div className="text-center text-muted-foreground py-