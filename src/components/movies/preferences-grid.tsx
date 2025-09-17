"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { recommendBasedOnInitialPreferences } from "@/ai/flows/recommend-based-on-initial-preferences";
import { movies } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { RecommendedMovie } from "@/lib/types";
import { MovieCard } from "./movie-card";

export default function PreferencesGrid() {
  const [selectedMovieIds, setSelectedMovieIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSelectMovie = (id: string) => {
    setSelectedMovieIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleSubmit = async () => {
    if (selectedMovieIds.size < 3) {
      toast({
        title: "Select more movies",
        description: "Please select at least 3 movies or series to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedMovies = movies.filter((m) => selectedMovieIds.has(m.id));
      const initialSelections = selectedMovies.map((m) => m.title);

      const result = await recommendBasedOnInitialPreferences({ initialSelections });

      if (result && result.recommendations) {
        const augmentedRecommendations: RecommendedMovie[] = result.recommendations.map((rec, index) => ({
          ...rec,
          id: crypto.randomUUID(),
          posterUrl: `https://picsum.photos/500/751?random=${21 + index}`, // Use a different random seed
          aiHint: rec.genre.toLowerCase(),
        }));
        
        localStorage.setItem("recommendations", JSON.stringify(augmentedRecommendations));
        
        toast({
          title: "Success!",
          description: "Your personalized home page is ready.",
        });
        router.push("/home");
      } else {
        throw new Error("Failed to get recommendations.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "We couldn't generate recommendations at this time. Please try again later.",
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
            movie={movie}
            onSelect={handleSelectMovie}
            isSelected={selectedMovieIds.has(movie.id)}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
      <div className="mt-8 md:mt-12 text-center">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Recommendations...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </>
  );
}
