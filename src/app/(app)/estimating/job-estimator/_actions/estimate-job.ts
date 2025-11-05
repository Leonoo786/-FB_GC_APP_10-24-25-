"use server";

import {
  aiJobEstimator,
  type AIJobEstimatorInput,
  type AIJobEstimatorOutput,
} from "@/ai/flows/ai-job-estimator";

export async function estimateJob(
  input: AIJobEstimatorInput
): Promise<AIJobEstimatorOutput> {
  try {
    const result = await aiJobEstimator(input);
    return result;
  } catch (error) {
    console.error("Error in AI job estimator flow:", error);
    throw new Error("Failed to generate job estimate.");
  }
}