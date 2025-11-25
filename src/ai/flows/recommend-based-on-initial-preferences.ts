'use server';
/**
 * @fileOverview Recomenda filmes e séries com base nas preferências iniciais do usuário.
 *
 * - recommendBasedOnInitialPreferences - Uma função que recebe as seleções iniciais de filmes/séries e retorna recomendações.
 * - RecommendBasedOnInitialPreferencesInput - O tipo de entrada para a função recommendBasedOnInitialPreferences.
 * - RecommendBasedOnInitialPreferencesOutput - O tipo de retorno para a função recommendBasedOnInitialPreferences.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendBasedOnInitialPreferencesInputSchema = z.object({
  initialSelections: z
    .array(
      z.string().describe('O título de um filme ou série que o usuário selecionou.')
    )
    .describe('Uma lista de filmes e séries que o usuário selecionou inicialmente.'),
});
export type RecommendBasedOnInitialPreferencesInput = z.infer<
  typeof RecommendBasedOnInitialPreferencesInputSchema
>;

const RecommendBasedOnInitialPreferencesOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        title: z.string().describe('O título do filme ou série recomendada.'),
        description: z
          .string()
          .describe('Uma breve descrição do filme ou da série.'),
        genre: z.string().describe('O gênero do filme ou da série.'),
        similarityReason: z
          .string()
          .describe(
            'A razão pela qual este filme ou série é recomendado com base nas seleções iniciais.'
          ),
      })
    )
    .describe('Uma lista de filmes e séries recomendados.'),
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
  prompt: `Você é um especialista em recomendação de filmes e séries. Com base nas seleções iniciais do usuário, você recomendará outros filmes e séries que ele possa gostar. Forneça um motivo pelo qual o conteúdo é semelhante às seleções iniciais. As recomendações, incluindo a razão da similaridade, devem ser em português do Brasil.

Seleções iniciais do usuário:
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
