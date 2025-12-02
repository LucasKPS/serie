'use server';
/**
 * @fileOverview Recomenda filmes e séries com base nas preferências iniciais do usuário.
 *
 * - recommendBasedOnInitialPreferences - Uma função que recebe as seleções iniciais de filmes/séries e retorna recomendações.
 * - RecommendBasedOnInitialPreferencesInput - O tipo de entrada para a função recommendBasedOnInitialPreferences.
 * - RecommendBasedOnInitialPreferencesOutput - O tipo de retorno para a função recommendBasedOnInitialPreferences.
 */

import {z} from 'genkit';
import { movies } from '@/lib/data';
import type { Movie } from '@/lib/types';

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

// Função principal que será chamada pela aplicação
export async function recommendBasedOnInitialPreferences(
  input: RecommendBasedOnInitialPreferencesInput
): Promise<RecommendBasedOnInitialPreferencesOutput> {
  // Encontra os filmes completos com base nos títulos selecionados
  const selectedMovies = input.initialSelections
    .map(title => movies.find(movie => movie.title === title))
    .filter((movie): movie is Movie => movie !== undefined);

  // Extrai os gêneros dos filmes selecionados
  const selectedGenres = new Set(selectedMovies.map(movie => movie.genre));

  // Filtra os filmes do catálogo para encontrar recomendações
  const potentialRecommendations = movies.filter(movie => 
    // Garante que o filme não seja um dos já selecionados
    !input.initialSelections.includes(movie.title) &&
    // Garante que o filme tenha um gênero correspondente
    selectedGenres.has(movie.genre)
  );

  // Embaralha e pega os 5 primeiros resultados para variedade
  const recommendations = potentialRecommendations
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map(movie => {
        const primarySelection = selectedMovies.find(sm => sm.genre === movie.genre);
        const reason = primarySelection 
            ? `Porque você gostou de "${primarySelection.title}", que também é do gênero ${movie.genre}.`
            : `Com base em seus interesses em filmes de ${movie.genre}.`;

        return {
            title: movie.title,
            description: movie.description,
            genre: movie.genre,
            similarityReason: reason,
        };
    });

    // Se não houver recomendações suficientes, preenche com filmes aleatórios
    if (recommendations.length < 5) {
        const additionalRecs = movies
            .filter(movie => !input.initialSelections.includes(movie.title) && !recommendations.some(r => r.title === movie.title))
            .sort(() => 0.5 - Math.random())
            .slice(0, 5 - recommendations.length)
            .map(movie => ({
                title: movie.title,
                description: movie.description,
                genre: movie.genre,
                similarityReason: `Uma sugestão popular para explorar novos gostos.`
            }));
        recommendations.push(...additionalRecs);
    }


  return { recommendations };
}
