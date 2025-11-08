"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import type { AIJobEstimatorOutput } from "@/ai/flows/ai-job-estimator";
import { estimateJob } from "../_actions/estimate-job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  jobDescription: z.string().min(20, {
    message: "Job description must be at least 20 characters.",
  }),
  blueprint: z.any().optional(),
});

export function JobEstimatorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIJobEstimatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    let blueprintDataUri: string | undefined;
    if (values.blueprint && values.blueprint[0]) {
      const file = values.blueprint[0] as File;
      const reader = new FileReader();
      blueprintDataUri = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const estimationResult = await estimateJob({
        jobDescription: values.jobDescription,
        blueprintDataUri,
      });
      setResult(estimationResult);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const totalCost = result?.budgetItems.reduce((acc, item) => acc + item.cost, 0) || 0;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Construction of a 2000 sq ft single-family home with a two-car garage..."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="blueprint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blueprint (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Estimate
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Estimated Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.budgetItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      {item.cost.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-secondary">
                    <TableCell colSpan={2}>Total Estimated Cost</TableCell>
                    <TableCell className="text-right">
                        {totalCost.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}