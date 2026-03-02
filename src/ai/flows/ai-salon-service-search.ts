'use server';
/**
 * @fileOverview An AI agent for intelligently searching for salons, services, or availability within a selected locality.
 *
 * - aiSalonServiceSearch - A function that handles the AI-powered search process.
 * - AISalonServiceSearchInput - The input type for the aiSalonServiceSearch function.
 * - AISalonServiceSearchOutput - The return type for the aiSalonServiceSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISalonServiceSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      'The natural language search query for salons, services, or availability.'
    ),
  locality: z.string().describe('The selected locality to filter the search.'),
});
export type AISalonServiceSearchInput = z.infer<
  typeof AISalonServiceSearchInputSchema
>;

const AISalonServiceSearchOutputSchema = z.object({
  searchResults: z
    .string()
    .describe(
      'A detailed summary of the identified salons, services, or availability based on the query and locality.'
    ),
});
export type AISalonServiceSearchOutput = z.infer<
  typeof AISalonServiceSearchOutputSchema
>;

export async function aiSalonServiceSearch(
  input: AISalonServiceSearchInput
): Promise<AISalonServiceSearchOutput> {
  return aiSalonServiceSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSalonServiceSearchPrompt',
  input: {schema: AISalonServiceSearchInputSchema},
  output: {schema: AISalonServiceSearchOutputSchema},
  prompt: `You are a helpful assistant for BookNGlow, a luxury salon booking platform.
Your task is to intelligently understand a user's natural language search query for salons, services, or appointment availability.

Consider the specified locality when providing relevant information. If the query is ambiguous or requires more information, ask clarifying questions.
Provide a detailed and helpful response summarizing the search results.

User Query: {{{query}}}
Selected Locality: {{{locality}}}

Based on this information, provide the search results:
`,
});

const aiSalonServiceSearchFlow = ai.defineFlow(
  {
    name: 'aiSalonServiceSearchFlow',
    inputSchema: AISalonServiceSearchInputSchema,
    outputSchema: AISalonServiceSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
