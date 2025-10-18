'use client';

import { useState } from 'react';
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
import { AddDrawingDialog } from '../_components/add-drawing-dialog';

// Mock data, will be replaced with real data later
const mockDrawings = [
  {
    id: '1',
    sheetNo: 'A-101',
    title: 'First Floor Plan',
    version: 3,
    date: '2024-06-15',
    description: 'Issued for Construction',
  },
  {
    id: '2',
    sheetNo: 'A-102',
    title: 'Second Floor Plan',
    version: 2,
    date: '2024-05-20',
    description: 'Issued for Bid',
  },
  {
    id: '3',
    sheetNo: 'S-201',
    title: 'Foundation Details',
    version: 1,
    date: '2024-04-01',
    description: 'Initial Release',
  },
];

export default function ProjectDrawingsPage() {
  const [isAddDrawingOpen, setIsAddDrawingOpen] = useState(false);

  return (
    <>
      <AddDrawingDialog
        open={isAddDrawingOpen}
        onOpenChange={setIsAddDrawingOpen}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Drawings</CardTitle>
              <CardDescription>
                Manage project drawings and versions.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDrawingOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Drawing
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Sheet No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[100px]">Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDrawings.map((drawing) => (
                <TableRow key={drawing.id}>
                  <TableCell className="font-medium">{drawing.sheetNo}</TableCell>
                  <TableCell>{drawing.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Ver. {drawing.version}</Badge>
                  </TableCell>
                  <TableCell>{drawing.date}</TableCell>
                  <TableCell>{drawing.description}</TableCell>
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
                          <FileText className="mr-2" /> View/Markup
                        </DropdownMenuItem>
                        <DropdownMenuItem>Upload New Version</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
