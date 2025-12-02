'use server';
/**
 * @fileOverview Resume os detalhes de um determinado filme ou série para gerar uma visão geral concisa.
 *
 * - summarizeMovieDetails - Uma função que lida com o processo de resumo do filme/série.
 * - SummarizeMovieDetailsInput - O tipo de entrada para a função summarizeMovieDetails.
 * - SummarizeMovieDetailsOutput - O tipo de retorno para a função summarizeMovieDetails.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMovieDetailsInputSchema = z.object({
  title: z.string().describe('O título do filme ou da série.'),
  description: z.string().describe('A descrição completa do filme ou da série.'),
  genre: z.string().describe('O gênero do filme ou da série.'),
  cast: z.string().describe('O elenco principal do filme ou da série.'),
});
export type SummarizeMovieDetailsInput = z.infer<typeof SummarizeMovieDetailsInputSchema>;

const SummarizeMovieDetailsOutputSchema = z.object({
  summary: z.string().describe('Um resumo curto, gerado por IA, dos detalhes do filme ou da série.'),
});
export type SummarizeMovieDetailsOutput = z.infer<typeof SummarizeMovieDetailsOutputSchema>;

export async function summarizeMovieDetails(input: SummarizeMovieDetailsInput): Promise<SummarizeMovieDetailsOutput> {
  return summarizeMovieDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMovieDetailsPrompt',
  input: {schema: SummarizeMovieDetailsInputSchema},
  output: {schema: SummarizeMovieDetailsOutputSchema},
  prompt: `Você é um especialista em sumarização de filmes e séries por IA para o projeto CineScope.

  Com base nos seguintes detalhes, crie um resumo conciso do filme ou série em português do Brasil. O resumo não deve ter mais de 50 palavras.

  Título: {{{title}}}
  Descrição: {{{description}}}
  Gênero: {{{genre}}}
  Elenco: {{{cast}}}

  Resumo:`,
});

const summarizeMovieDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeMovieDetailsFlow',
    inputSchema: SummarizeMovieDetailsInputSchema,
    outputSchema: SummarizeMovieDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {model: 'gemini-1.5-flash-latest'});
    return output!;
  }
);
