'use server';
/**
 * @fileOverview Recommends movies and series based on the user's initial preferences.
 *
 * - recommendBasedOnInitialPreferences - A function that takes initial movie/series selections and returns recommendations.
 * - RecommendBasedOnInitialPreferencesInput - The input type for the recommendBasedOnInitialPreferences function.
 * - RecommendBasedOnInitialPreferencesOutput - The return type for the recommendBasedOnInitialPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendBasedOnInitialPreferencesInputSchema = z.object({
  initialSelections: z
    .array(
      z.string().describe('The title of a movie or series the user selected.')
    )
    .describe('A list of movies and series the user initially selected.'),
});
export type RecommendBasedOnInitialPreferencesInput = z.infer<
  typeof RecommendBasedOnInitialPreferencesInputSchema
>;

const RecommendBasedOnInitialPreferencesOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        title: z.string().describe('The title of the recommended movie or series.'),
        description: z.string().describe('A brief description of the movie or series.'),
        genre: z.string().describe('The genre of the movie or series.'),
        similarityReason: z
          .string()
          .describe(
            'The reason why this movie or series is recommended based on the initial selections.'
          ),
      })
    )
    .describe('A list of recommended movies and series.'),
});
export type RecommendBasedOnInitialPreferencesOutput = z.infer<
  typeof RecommendBasedOnInitialPreferencesOutputSchema
>;

export async function recommendBasedOnInitialPreferences(
  input: RecommendBasedOnInitialPreferencesInput
): Promise<RecommendBasedOnInitialPreferencesOutput> {
  return recommendBasedOnInitialPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBasedOnInitialPreferencesPrompt',
  input: {schema: RecommendBasedOnInitialPreferencesInputSchema},
  output: {schema: RecommendBasedOnInitialPreferencesOutputSchema},
  prompt: `You are a movie and series recommendation expert. Based on the user's initial selections, you will recommend other movies and series they might enjoy.  Provide a reason as to why the content is similar to the intial selections.

User's initial selections:
{{#each initialSelections}}- {{{this}}}
{{/each}}`,
});

const recommendBasedOnInitialPreferencesFlow = ai.defineFlow(
  {
    name: 'recommendBasedOnInitialPreferencesFlow',
    inputSchema: RecommendBasedOnInitialPreferencesInputSchema,
    outputSchema: RecommendBasedOnInitialPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
