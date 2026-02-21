'use server';
/**
 * @fileOverview This file provides an AI-powered flow for generating ebook search suggestions.
 *
 * - getEbookSearchSuggestions - A function that generates search suggestions based on a partial query.
 * - EbookSearchSuggestionInput - The input type for the getEbookSearchSuggestions function.
 * - EbookSearchSuggestionOutput - The return type for the getEbookSearchSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EbookSearchSuggestionInputSchema = z.object({
  partialQuery: z.string().describe('The partial search query typed by the user.'),
});
export type EbookSearchSuggestionInput = z.infer<typeof EbookSearchSuggestionInputSchema>;

const EbookSearchSuggestionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of relevant ebook search suggestions.'),
});
export type EbookSearchSuggestionOutput = z.infer<typeof EbookSearchSuggestionOutputSchema>;

export async function getEbookSearchSuggestions(
  input: EbookSearchSuggestionInput
): Promise<EbookSearchSuggestionOutput> {
  return ebookSearchSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ebookSearchSuggestionPrompt',
  input: {schema: EbookSearchSuggestionInputSchema},
  output: {schema: EbookSearchSuggestionOutputSchema},
  prompt: `You are an AI assistant that provides relevant ebook search suggestions.

Generate up to 5 diverse and helpful ebook search suggestions based on the user's partial input. Ensure the suggestions cover different aspects or popular related topics.

Partial Query: {{{partialQuery}}}`,
});

const ebookSearchSuggestionFlow = ai.defineFlow(
  {
    name: 'ebookSearchSuggestionFlow',
    inputSchema: EbookSearchSuggestionInputSchema,
    outputSchema: EbookSearchSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
