'use server';

/**
 * @fileOverview This file defines the AI Change Order Automation flow.
 *
 * - suggestChangeOrder - An AI function that suggests a potential change order based on new RFI answers or issues.
 * - SuggestChangeOrderInput - The input type for the suggestChangeOrder function.
 * - SuggestChangeOrderOutput - The return type for the suggestChangeOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChangeOrderInputSchema = z.object({
  rfiAnswer: z.string().optional().describe('The answer to the RFI, if applicable.'),
  issueDescription: z.string().optional().describe('The description of the issue, if applicable.'),
  projectDescription: z.string().describe('Project description to give more context.'),
  currentChangeOrders: z.string().describe('Current change orders for the project.')
});
export type SuggestChangeOrderInput = z.infer<typeof SuggestChangeOrderInputSchema>;

const SuggestChangeOrderOutputSchema = z.object({
  suggestChangeOrder: z.boolean().describe('Whether or not a change order is suggested.'),
  description: z.string().describe('The suggested description for the change order.'),
  potentialCostImpact: z.number().describe('The potential cost impact of the change order.'),
});
export type SuggestChangeOrderOutput = z.infer<typeof SuggestChangeOrderOutputSchema>;

export async function suggestChangeOrder(input: SuggestChangeOrderInput): Promise<SuggestChangeOrderOutput> {
  return suggestChangeOrderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChangeOrderPrompt',
  input: {schema: SuggestChangeOrderInputSchema},
  output: {schema: SuggestChangeOrderOutputSchema},
  prompt: `You are an AI assistant that reviews project information such as project description, current change orders, RFIs and Issues.

You will make a determination as to whether a change order is suggested or not, and set the suggestChangeOrder appropriately. Provide a description and potential cost impact if a change order is suggested. If a change order is not suggested, return empty strings for description and potentialCostImpact. Always respond in the specified JSON format.

Consider these factors when suggesting a change order:
* Scope Change: If the RFI answer or issue introduces work outside the original project scope.
* Unforeseen Conditions: If the RFI answer or issue reveals unexpected site conditions or discrepancies in plans.
* Delays: If the RFI answer or issue will likely cause project delays.
* Cost Increases: If the RFI answer or issue requires additional materials, labor, or equipment.

Description: {{{projectDescription}}}
Current Change Orders: {{{currentChangeOrders}}}
RFI Answer: {{{rfiAnswer}}}
Issue Description: {{{issueDescription}}}`, 
});

const suggestChangeOrderFlow = ai.defineFlow(
  {
    name: 'suggestChangeOrderFlow',
    inputSchema: SuggestChangeOrderInputSchema,
    outputSchema: SuggestChangeOrderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
