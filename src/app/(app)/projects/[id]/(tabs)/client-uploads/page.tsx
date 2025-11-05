'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Download,
  Edit,
  File as FileIcon,
  Trash2,
  Upload,
} from 'lucide-react';

const mockUploads = [
  {
    id: '1',
    fileName: 'Signed_CO-001.pdf',
    fileSize: '117.19 KB',
    uploadedAt: 'over 2 years ago',
  },
  {
    id: '2',
    fileName: 'Lobby_Finish_Selection.jpg',
    fileSize: '83.01 KB',
    uploadedAt: 'over 2 years ago',
  },
];

export default function ProjectClientUploadsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Uploads</CardTitle>
        <CardDescription>
          Documents and files uploaded by the client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUploads.map((upload) => (
            <div
              key={upload.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{upload.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {upload.fileSize} &bull; {upload.uploadedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Download</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-5 w-5" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" className='text-destructive hover:text-destructive'>
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
          <Button className="w-full" size="lg">
            <Upload className="mr-2" />
            Upload a File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}