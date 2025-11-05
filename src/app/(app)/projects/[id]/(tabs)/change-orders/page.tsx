// app/(app)/projects/[id]/(tabs)/change-orders/page.tsx
'use client';

import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, FileText } from 'lucide-react';
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
import { AddChangeOrderDialog } from '../../_components/add-change-order-dialog';
import { AppStateContext } from '@/context/app-state-context';
import type { ChangeOrder } from '@/lib/types';
import { notFound } from 'next/navigation';

export default function ProjectChangeOrdersPage({
  params,
}: {
  params: { id: string };
}) {
  const [isAddChangeOrderOpen, setIsAddChangeOrderOpen] = useState(false);
  const appState = useContext(AppStateContext);

  if (!appState) return <div>Loading...</div>;

  const { projects, changeOrders } = appState;
  const project = projects.find((p) => p.id === params.id);
  if (!project) notFound();

  const projectChangeOrders = changeOrders.filter(
    (co) => co.projectId === params.id
  );

  const statusVariant: Record<ChangeOrder['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
    Submitted: 'secondary',
    Approved: 'default',
    Executed: 'outline',
    Rejected: 'destructive',
  };

  return (
    <>
      <AddChangeOrderDialog
        open={isAddChangeOrderOpen}
        onOpenChange={setIsAddChangeOrderOpen}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Change Orders</CardTitle>
              <CardDescription>
                Manage all change orders for this project.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddChangeOrderOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Change Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">CO #</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right w-[150px]">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileText className="mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {projectChangeOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No change orders for this project yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}