
'use client';

import { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { changeOrders, projects } from '@/lib/data';
import { notFound } from 'next/navigation';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddChangeOrderDialog } from '../_components/add-change-order-dialog';
import type { ChangeOrder } from '@/lib/types';


export default function ProjectChangeOrdersPage({
  params,
}: {
  params: { id: string };
}) {
  const [isAddCOOpen, setIsAddCOOpen] = useState(false);
  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    notFound();
  }
  const projectChangeOrders = changeOrders.filter(
    (co) => co.projectId === params.id
  );

  const statusVariant: Record<ChangeOrder['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
    Submitted: 'secondary',
    Approved: 'default',
    Executed: 'outline',
    Rejected: 'destructive'
  };

  return (
    <>
      <AddChangeOrderDialog open={isAddCOOpen} onOpenChange={setIsAddCOOpen} />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Change Orders</CardTitle>
              <CardDescription>
                Manage and automate change orders for this project.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddCOOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Change Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">CO#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectChangeOrders.map((co) => (
                <TableRow key={co.id}>
                  <TableCell className="font-medium">{co.coNumber}</TableCell>
                  <TableCell>{co.description}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[co.status]}>{co.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {co.totalRequest.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <Button variant="outline" size="sm" disabled={co.status !== 'Approved'}>Run Automation</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
