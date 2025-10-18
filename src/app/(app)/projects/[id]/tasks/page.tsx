
'use client';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { use } from "react";

export default function ProjectTasksPage({ params: paramsProp }: { params: Promise<{ id: string }> }) {
  const params = use(paramsProp);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      <p>Tasks for this project will be displayed here.</p>
    </div>
  );
}
