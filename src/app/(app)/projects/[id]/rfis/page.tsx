
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
import { notFound, useParams } from 'next/navigation';
import { AddRfiDialog } from '../_components/add-rfi-dialog';
import { format } from 'date-fns';
import type { RFI } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AppStateContext } from '@/context/app-state-context';

export default function ProjectRFIsPage() {
  const params = useParams<{ id: string }>();
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Requests for Information</CardTitle>
              <CardDescription>
                Manage all RFIs for this project.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddRfiOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add RFI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">RFI #</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectRFIs.map((rfi) => (
                  <TableRow key={rfi.id}>
                    <TableCell className="font-medium">{rfi.rfiNumber}</TableCell>
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
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
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

          <div className="md:hidden">
            <Accordion type="single" collapsible className="w-full">
              {projectRFIs.map((rfi) => (
                <AccordionItem value={rfi.id} key={rfi.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold">{rfi.rfiNumber}</span>
                      <span className="text-sm text-muted-foreground">{rfi.subject}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 px-1">
                      <div className='flex justify-between items-center'>
                        <span className="text-sm font-medium">Status</span>
                         <Badge variant={statusVariant[rfi.status]}>
                          {rfi.status}
                        </Badge>
                      </div>
                       <div className='flex justify-between items-center'>
                        <span className="text-sm font-medium">Date Submitted</span>
                        <span className="text-sm">{format(new Date(rfi.dateSubmitted), 'PP')}</span>
                      </div>
                      <div className="border-t pt-3">
                        <p className='font-semibold'>Question:</p>
                        <p className="text-sm text-muted-foreground">{rfi.question}</p>
                      </div>
                      {rfi.answer && (
                         <div className="border-t pt-3">
                          <p className='font-semibold'>Answer:</p>
                          <p className="text-sm text-muted-foreground">{rfi.answer}</p>
                        </div>
                      )}
                      <Button className='w-full' variant='outline'>
                        <MessageSquare className='mr-2' /> Respond
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {projectRFIs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileQuestion className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-semibold">No RFIs yet</h3>
              <p className="mt-1 text-sm">
                Get started by creating a new Request for Information.
              </p>
              <Button className="mt-6" onClick={() => setIsAddRfiOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add RFI
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
