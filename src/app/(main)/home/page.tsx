
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard } from "@/components/movies/movie-card";
import type { RecommendedMovie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [groupedRecs, setGroupedRecs] = useState<Record<string, RecommendedMovie[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedRecs = localStorage.getItem("recommendations");
      if (storedRecs) {
        const parsedRecs: RecommendedMovie[] = JSON.parse(storedRecs);
        setRecommendations(parsedRecs);

        const groups: Record<string, RecommendedMovie[]> = {};
        parsedRecs.forEach(rec => {
          const key = rec.similarityReason;
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(rec);
        });
        setGroupedRecs(groups);
      }
    } catch (error) {
      console.error("Falha ao analisar as recomendações do localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (recommendations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Nenhuma recomendação encontrada</h2>
        <p className="text-muted-foreground mb-6">
          Parece que você ainda não definiu suas preferências.
        </p>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/">Obter Recomendações</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {Object.entries(groupedRecs).map(([reason, movies]) => (
        <section key={reason}>
          <h2 className="text-xl font-semibold tracking-tight mb-4 font-headline">{reason}</h2>
          <Carousel
            opts={{
              align: "start",
              loop: movies.length > 5,
            }}
            className="w-full"
          >
            <CarouselContent>
              {movies.map((movie) => (
                <CarouselItem key={movie.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                  <Link href={`/movie/${movie.id}`}>
                    <MovieCard movie={movie} />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {[1, 2, 3].map(i => (
        <section key={i}>
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map(j => (
              <div key={j} className="w-1/5 shrink-0">
                <Skeleton className="aspect-[2/3] w-full" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
