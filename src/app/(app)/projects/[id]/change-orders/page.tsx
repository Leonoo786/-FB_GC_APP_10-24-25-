import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProjectChangeOrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Change Orders</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Change Order
        </Button>
      </div>
      <p>Change orders for this project will be displayed here.</p>
    </div>
  );
}
