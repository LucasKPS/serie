// Summarize the details of a given movie or series to generate a concise overview.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMovieDetailsInputSchema = z.object({
  title: z.string().describe('The title of the movie or series.'),
  description: z.string().describe('The full description of the movie or series.'),
  genre: z.string().describe('The genre of the movie or series.'),
  cast: z.string().describe('The main cast members of the movie or series.'),
});
export type SummarizeMovieDetailsInput = z.infer<typeof SummarizeMovieDetailsInputSchema>;

const SummarizeMovieDetailsOutputSchema = z.object({
  summary: z.string().describe('A short, AI-generated summary of the movie or series details.'),
});
export type SummarizeMovieDetailsOutput = z.infer<typeof SummarizeMovieDetailsOutputSchema>;

export async function summarizeMovieDetails(input: SummarizeMovieDetailsInput): Promise<SummarizeMovieDetailsOutput> {
  return summarizeMovieDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMovieDetailsPrompt',
  input: {schema: SummarizeMovieDetailsInputSchema},
  output: {schema: SummarizeMovieDetailsOutputSchema},
  prompt: `You are an AI movie and series summarization expert.

  Given the following details, create a concise summary of the movie or series. The summary should be no more than 50 words.

  Title: {{{title}}}
  Description: {{{description}}}
  Genre: {{{genre}}}
  Cast: {{{cast}}}

  Summary:`,
});

const summarizeMovieDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeMovieDetailsFlow',
    inputSchema: SummarizeMovieDetailsInputSchema,
    outputSchema: SummarizeMovieDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
