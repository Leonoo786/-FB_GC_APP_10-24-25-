import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProjectClientUploadsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Client Uploads</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Upload
        </Button>
      </div>
      <p>Client uploads for this project will be displayed here.</p>
    </div>
  );
}
