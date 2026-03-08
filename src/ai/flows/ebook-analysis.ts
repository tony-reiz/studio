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
    .describe('Une liste de 3 à 5 mots-clés pertinents pour améliorer la découvrabilité.'),
  descriptionFeedback: z
    .string()
    .describe('Une courte phrase de feedback actionnable pour améliorer la description.'),
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
  prompt: `Vous êtes un expert en SEO et marketing pour les livres numériques.
En vous basant sur le titre et la description de l'ebook fournis, veuillez effectuer l'analyse suivante en français :

1.  Générez une liste de 3 à 5 mots-clés très pertinents qui aideraient les acheteurs potentiels à découvrir cet ebook sur une marketplace. Les mots-clés doivent être concis et correspondre à des termes de recherche populaires.
2.  Fournissez une seule phrase de feedback actionnable pour améliorer la description actuelle. Concentrez-vous sur la manière de la rendre plus convaincante ou plus claire pour un acheteur potentiel.

Titre de l'ebook : {{{title}}}
Description de l'ebook : {{{description}}}`,
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
