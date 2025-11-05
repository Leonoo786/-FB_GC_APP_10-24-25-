
'use client';

import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  PlusCircle,
  FileQuestion,
  MessageSquare,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notFound } from 'next/navigation';
import { AddRfiDialog } from '../../_components/add-rfi-dialog';
import { format } from 'date-fns';
import type { RFI } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AppStateContext } from '@/context/app-state-context';

export default function ProjectRFIsPage({ params }: { params: { id: string } }) {
  const [isAddRfiOpen, setIsAddRfiOpen] = useState(false);
  const appState = useContext(AppStateContext);

  if (!appState) {
    return <div>Loading...</div>
  }
  const { projects, rfis } = appState;

  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    notFound();
  }
  const projectRFIs = rfis.filter((rfi) => rfi.projectId === params.id);

  const statusVariant: Record<RFI['status'], 'default' | 'secondary'> = {
    Open: 'default',
    Closed: 'secondary',
  };

  return (
    <>
      <AddRfiDialog open={isAddRfiOpen} onOpenChange={setIsAddRfiOpen} />
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <div>
              <CardTitle class="text-2xl">Requests for Information</CardTitle>
              <CardDescription>
                Manage all RFIs for this project.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddRfiOpen(true)}>
              <PlusCircle class="mr-2 h-4 w-4" /> Add RFI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[120px]">RFI #</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead class="w-[120px]">Date</TableHead>
                  <TableHead class="w-[120px]">Status</TableHead>
                  <TableHead class="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectRFIs.map((rfi) => (
                  <TableRow key={rfi.id}>
                    <TableCell class="font-medium">{rfi.rfiNumber}</TableCell>
                    <TableCell>{rfi.subject}</TableCell>
                    <TableCell>{format(new Date(rfi.dateSubmitted), 'PP')}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[rfi.status]}>
                        {rfi.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal class="h-4 w-4" />
                            <span class="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Respond</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div class="md:hidden">
            <Accordion type="single" collapsible class="w-full">
              {projectRFIs.map((rfi) => (
                <AccordionItem value={rfi.id} key={rfi.id}>
                  <AccordionTrigger>
                    <div class="flex flex-col items-start text-left">
                      <span class="font-semibold">{rfi.rfiNumber}</span>
                      <span class="text-sm text-muted-foreground">{rfi.subject}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div class="space-y-3 px-1">
                      <div class='flex justify-between items-center'>
                        <span class="text-sm font-medium">Status</span>
                         <Badge variant={statusVariant[rfi.status]}>
                          {rfi.status}
                        </Badge>
                      </div>
                       <div class='flex justify-between items-center'>
                        <span class="text-sm font-medium">Date Submitted</span>
                        <span class="text-sm">{format(new Date(rfi.dateSubmitted), 'PP')}</span>
                      </div>
                      <div class="border-t pt-3">
                        <p class='font-semibold'>Question:</p>
                        <p class="text-sm text-muted-foreground">{rfi.question}</p>
                      </div>
                      {rfi.answer && (
                         <div class="border-t pt-3">
                          <p class='font-semibold'>Answer:</p>
                          <p class="text-sm text-muted-foreground">{rfi.answer}</p>
                        </div>
                      )}
                      <Button class='w-full' variant='outline'>
                        <MessageSquare class='mr-2' /> Respond
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {projectRFIs.length === 0 && (
            <div class="text-center py-12 text-muted-foreground">
              <FileQuestion class="mx-auto h-12 w-12" />
              <h3 class="mt-2 text-sm font-semibold">No RFIs yet</h3>
              <p class="mt-1 text-sm">
                Get started by creating a new Request for Information.
              </p>
              <Button class="mt-6" onClick={() => setIsAddRfiOpen(true)}>
                <PlusCircle class="mr-2 h-4 w-4" /> Add RFI
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
