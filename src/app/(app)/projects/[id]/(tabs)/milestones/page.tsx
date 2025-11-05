

'use client';

import { useState, useContext } from 'react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, MoreVertical, Flag } from 'lucide-react';
import { AppStateContext } from '@/context/app-state-context';
import type { Milestone } from '@/lib/types';
import { AddEditMilestoneDialog } from '../_components/add-edit-milestone-dialog';
import { Badge } from '@/components/ui/badge';
import { format, isPast } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function ProjectMilestonesPage({
  params,
}: {
  params: { id: string };
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const { toast } = useToast();
  const appState = useContext(AppStateContext);

  if (!appState) {
    return <div>Loading...</div>;
  }
  const { projects, milestones, setMilestones } = appState;
  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    notFound();
  }

  const projectMilestones = milestones.filter(
    (m) => m.projectId === params.id
  ).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleNewMilestone = () => {
    setSelectedMilestone(null);
    setIsDialogOpen(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsDialogOpen(true);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    setMilestones(prev => prev.filter(m => m.id !== milestoneId));
    toast({
      title: 'Milestone Deleted',
      description: 'The milestone has been successfully removed.',
      variant: 'destructive',
    });
  };

  const handleSaveMilestone = (milestone: Milestone) => {
    if (milestone.id) {
        setMilestones(prev => prev.map(m => m.id === milestone.id ? milestone : m));
    } else {
        setMilestones(prev => [...prev, { ...milestone, id: crypto.randomUUID() }]);
    }
  };

  const statusVariant: Record<Milestone['status'], 'default' | 'secondary' | 'outline'> = {
    'Completed': 'default',
    'In Progress': 'secondary',
    'Upcoming': 'outline',
  };

  return (
    <>
      <AddEditMilestoneDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        milestone={selectedMilestone}
        onSave={handleSaveMilestone}
        projectId={params.id}
      />
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <div>
              <CardTitle class="text-2xl">Project Milestones</CardTitle>
              <CardDescription>
                Track major project goals and deadlines.
              </CardDescription>
            </div>
            <Button onClick={handleNewMilestone}>
              <PlusCircle class="mr-2 h-4 w-4" /> Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projectMilestones.length === 0 ? (
            <div class="text-center py-12 text-muted-foreground">
              <Flag class="mx-auto h-12 w-12" />
              <h3 class="mt-2 text-sm font-semibold">No milestones yet</h3>
              <p class="mt-1 text-sm">
                Get started by creating a new project milestone.
              </p>
              <Button class="mt-6" onClick={handleNewMilestone}>
                <PlusCircle class="mr-2 h-4 w-4" /> Add Milestone
              </Button>
            </div>
          ) : (
            <div class="space-y-4">
              {projectMilestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent class="p-4 flex items-start justify-between">
                    <div class="flex-1 space-y-2">
                      <div class="flex items-center gap-4">
                        <h3 class="font-semibold text-lg">{milestone.name}</h3>
                        <Badge variant={statusVariant[milestone.status]}>{milestone.status}</Badge>
                      </div>
                      <p class="text-sm text-muted-foreground">{milestone.description}</p>
                      <p class="text-sm">
                        <strong>Due:</strong> {format(new Date(milestone.dueDate), 'PPP')}
                        {milestone.status !== 'Completed' && isPast(new Date(milestone.dueDate)) && (
                            <span class="text-destructive font-medium ml-2">(Overdue)</span>
                        )}
                      </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" class="h-8 w-8">
                                <MoreVertical class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditMilestone(milestone)}>Edit</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} class="text-destructive">Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the milestone "{milestone.name}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteMilestone(milestone.id)} class="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
