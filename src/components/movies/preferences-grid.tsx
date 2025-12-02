
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { collection, doc, writeBatch } from "firebase/firestore";

import { recommendBasedOnInitialPreferences } from "@/ai/flows/recommend-based-on-initial-preferences";
import { movies } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Movie, RecommendedMovie } from "@/lib/types";
import { MovieCard } from "./movie-card";
import { useFirebase } from "@/firebase";

// Função para simular um atraso
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function PreferencesGrid() {
  const [selectedMovieIds, setSelectedMovieIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  const handleSelectMovie = (id: string) => {
    setSelectedMovieIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        if (newSelection.size >= 3) {
          toast({
            title: "Limite de seleção atingido",
            description: "Você pode selecionar no máximo 3 itens.",
            variant: "destructive",
          });
          return prev; 
        }
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const saveRecommendationsToFirestore = async (recommendations: RecommendedMovie[]) => {
    if (!user || !firestore) return;

    const batch = writeBatch(firestore);
    const recommendationsRef = collection(firestore, 'users', user.uid, 'recommendations');

    recommendations.forEach(rec => {
      const movieMatch = movies.find(m => m.title.toLowerCase() === rec.title.toLowerCase());
      const newRecRef = doc(recommendationsRef); 
      
      batch.set(newRecRef, {
        id: newRecRef.id,
        userId: user.uid,
        movieId: movieMatch?.id || null,
        seriesId: null, // Assumindo que são todos filmes por agora
        reason: rec.similarityReason,
        recommendationDate: new Date().toISOString(),
        title: rec.title,
        posterUrl: rec.posterUrl,
        genre: rec.genre
      });
    });

    try {
      await batch.commit();
    } catch (error) {
      console.error("Erro ao salvar recomendações no Firestore:", error);
      // Opcional: Adicionar um toast de erro aqui se a falha for crítica
    }
  };


  const handleSubmit = async () => {
    if (selectedMovieIds.size !== 3) {
      toast({
        title: "Seleção incompleta",
        description: "Por favor, selecione exatamente 3 filmes ou séries para obter recomendações.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simula o tempo de processamento da IA
      await sleep(1500);

      const selectedMovies = movies.filter((m) => selectedMovieIds.has(m.id));
      const initialSelections = selectedMovies.map((m) => m.title);

      const result = await recommendBasedOnInitialPreferences({ initialSelections });

      if (result && result.recommendations) {
        const augmentedRecommendations: RecommendedMovie[] = result.recommendations.map((rec, index) => {
          const movieMatch = movies.find(m => m.title.toLowerCase() === rec.title.toLowerCase());
          return {
            ...rec,
            id: movieMatch?.id || crypto.randomUUID(),
            posterUrl: movieMatch?.posterUrl || `https://picsum.photos/seed/${index + 100}/500/750`,
            aiHint: rec.genre.toLowerCase(),
          }
        });
        
        localStorage.setItem("recommendations", JSON.stringify(augmentedRecommendations));

        await saveRecommendationsToFirestore(augmentedRecommendations);
        
        toast({
          title: "Análise Concluída!",
          description: "Suas recomendações personalizadas estão prontas.",
        });
        router.push("/home");
      } else {
        throw new Error("Falha ao obter recomendações.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Ocorreu um erro",
        description: "Não foi possível gerar recomendações no momento. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie as Movie}
            onSelect={handleSelectMovie}
            isSelected={selectedMovieIds.has(movie.id)}
            className="animate-fade-in-up"
            index={index}
          />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
        <div className="container mx-auto flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || selectedMovieIds.size !== 3}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando seu gosto...
                </>
              ) : (
                `Gerar Recomendações (${selectedMovieIds.size}/3)`
              )}
            </Button>
        </div>
      </div>
    </>
  );
}
