'use server';
/**
 * @fileOverview This file provides an AI-powered flow for analyzing an ebook listing.
 *
 * - analyzeEbookListing - A function that generates analysis and suggestions for an ebook.
 * - EbookAnalysisInput - The input type for the analyzeEbookListing function.
 * - EbookAnalysisOutput - The return type for the analyzeEbookListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EbookAnalysisInputSchema = z.object({
  title: z.string().describe('The title of the ebook.'),
  description: z.string().describe('The description of the ebook.'),
});
export type EbookAnalysisInput = z.infer<typeof EbookAnalysisInputSchema>;

const EbookAnalysisOutputSchema = z.object({
  suggestedKeywords: z
    .array(z.string())
    .describe('A list of 3 to 5 relevant keywords to improve discoverability.'),
  descriptionFeedback: z
    .string()
    .describe('A short, actionable feedback sentence to improve the description.'),
});
export type EbookAnalysisOutput = z.infer<typeof EbookAnalysisOutputSchema>;

export async function analyzeEbookListing(
  input: EbookAnalysisInput
): Promise<EbookAnalysisOutput> {
  return ebookAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ebookAnalysisPrompt',
  input: {schema: EbookAnalysisInputSchema},
  output: {schema: EbookAnalysisOutputSchema},
  prompt: `You are an expert in SEO and marketing for digital books.
Based on the ebook title and description provided, please perform the following analysis:

1.  Generate a list of 3 to 5 highly relevant keywords that would help potential buyers discover this ebook on a marketplace. The keywords should be concise and popular search terms.
2.  Provide one single sentence of actionable feedback to improve the current description. Focus on making it more compelling or clear for a potential buyer.

Ebook Title: {{{title}}}
Ebook Description: {{{description}}}`,
});

const ebookAnalysisFlow = ai.defineFlow(
  {
    name: 'ebookAnalysisFlow',
    inputSchema: EbookAnalysisInputSchema,
    outputSchema: EbookAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
