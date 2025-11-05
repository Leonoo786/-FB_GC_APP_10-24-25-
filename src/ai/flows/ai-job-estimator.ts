'use server';

/**
 * @fileOverview AI Job Estimator flow.
 *
 * - aiJobEstimator - A function that generates a preliminary budget with line items based on a blueprint or description.
 * - AIJobEstimatorInput - The input type for the aiJobEstimator function.
 * - AIJobEstimatorOutput - The return type for the aiJobEstimator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIJobEstimatorInputSchema = z.object({
  jobDescription: z.string().describe('A detailed description of the construction job, including scope, materials, and specific requirements.'),
  blueprintDataUri: z.string().optional().describe(
    "A blueprint of the job, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

export type AIJobEstimatorInput = z.infer<typeof AIJobEstimatorInputSchema>;

const AIJobEstimatorOutputSchema = z.object({
  budgetItems: z.array(
    z.object({
      category: z.string().describe('The budget category for the line item.'),
      description: z.string().describe('A description of the budget item.'),
      cost: z.number().describe('The estimated cost for the budget item.'),
    })
  ).describe('A list of budget items with categories, descriptions, and estimated costs.'),
});

export type AIJobEstimatorOutput = z.infer<typeof AIJobEstimatorOutputSchema>;

export async function aiJobEstimator(input: AIJobEstimatorInput): Promise<AIJobEstimatorOutput> {
  return aiJobEstimatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiJobEstimatorPrompt',
  input: {schema: AIJobEstimatorInputSchema},
  output: {schema: AIJobEstimatorOutputSchema},
  prompt: `You are an AI job estimator that generates a preliminary budget with line items based on a blueprint or description.

  The budget should be broken down into the following categories:
  - Ansul System
  - Bathroom Partitions
  - Bollards/Stoppers
  - Change Order
  - Cleaning
  - CMU
  - Doors/Hardware
  - Electrical
  - Exterior panels
  - Fences
  - Floor
  - Foundation Labor
  - Foundation Material
  - Foundation-Piers Labor
  - Framing Labor
  - Framing Material
  - Fuel Canopy Labor
  - Fuel Canopy Material
  - FuelCanopyBricks
  - Get Reimbursed
  - Grass Cut
  - Haul-Off
  - HVAC
  - KnoxBox
  - Landsacpe Labor
  - Landsacpe Material
  - Millwork
  - Misc
  - Nichiha Labor
  - Nichiha Material
  - Paint Labor
  - Paint Material
  - Parking lot Labor
  - Parking lot Material
  - Permit
  - Plumbing
  - Pollution Control
  - Rental
  - Roof
  - Sitework Labor
  - Sitework Material
  - Steel Labor
  - Steel Material
  - StoreFrontCanopy Labor
  - StoreFrontCanopy Material
  - Store Front Glass
  - Striping
  - Stucco/Stone
  - Survey
  - SWPP
  - Tiles Labor
  - Tiles Material
  - TO BE PAID
  - Undrgrnd pipes Labor
  - Undrgrnd pipes Material
  - Utility Bill
  - Venthood
  - Builders Risk
  - Curbs Labor
  - Curbs Material
  - Sitework Material
  - Sidewalk Labor
  - Sidewalk Material
  - Dirtwork-Lbr

  Job Description: {{{jobDescription}}}
  {{~#if blueprintDataUri}}
  Blueprint: {{media url=blueprintDataUri}}
  {{~/if}}

  Generate a preliminary budget with line items based on the job description and blueprint (if provided).
  Include a category, description, and estimated cost for each line item.
  Make sure to output a valid JSON object conforming to the AIJobEstimatorOutputSchema schema.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const aiJobEstimatorFlow = ai.defineFlow(
  {
    name: 'aiJobEstimatorFlow',
    inputSchema: AIJobEstimatorInputSchema,
    outputSchema: AIJobEstimatorOutputSchema,
  