
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
        <div class="space-y-4">
          {mockUploads.map((upload) => (
            <div
              key={upload.id}
              class="flex items-center justify-between rounded-lg border p-4"
            >
              <div class="flex items-center gap-4">
                <FileIcon class="h-8 w-8 text-muted-foreground" />
                <div>
                  <p class="font-medium">{upload.fileName}</p>
                  <p class="text-sm text-muted-foreground">
                    {upload.fileSize} &bull; {upload.uploadedAt}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Download class="h-5 w-5" />
                  <span class="sr-only">Download</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit class="h-5 w-5" />
                  <span class="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" class='text-destructive hover:text-destructive'>
                  <Trash2 class="h-5 w-5" />
                  <span class="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
          <Button class="w-full" size="lg">
            <Upload class="mr-2" />
            Upload a File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
