import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobEstimatorForm } from "./_components/job-estimator-form";

export default function JobEstimatorPage() {
  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">AI Job Estimator</h1>
        <p class="text-muted-foreground">
          Generate a preliminary budget from a job description or blueprint.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Estimate</CardTitle>
          <CardDescription>
            Provide as much detail as possible for a more accurate estimate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobEstimatorForm />
        </CardContent>
      </Card>
    </div>
  );
}
