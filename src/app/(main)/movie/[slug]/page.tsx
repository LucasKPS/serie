"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { RecommendedMovie } from "@/lib/types";
import AiSummary from "@/components/movies/ai-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

export default function MovieDetailPage({ params }: { params: { slug: string } }) {
  const [movie, setMovie] = useState<RecommendedMovie | null>(null);
  const [isLoading, setIsLoading] =useState(true);
  const { slug } = params;

  useEffect(() => {
    try {
      const storedRecs = localStorage.getItem("recommendations");
      if (storedRecs) {
        const parsedRecs: RecommendedMovie[] = JSON.parse(storedRecs);
        const foundMovie = parsedRecs.find(m => m.id === slug);
        if(foundMovie) {
            setMovie(foundMovie);
        } else {
            notFound();
        }
      }
    } catch (error) {
      console.error("Falha ao carregar os dados do filme", error);
      notFound();
    } finally {
        setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!movie) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] w-full max-w-sm mx-auto">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              width={500}
              height={750}
              className="rounded-lg object-cover shadow-2xl"
              data-ai-hint={movie.aiHint}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Badge variant="secondary" className="mb-2">{movie.genre}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">{movie.title}</h1>
          
          <div className="prose prose-invert max-w-none text-muted-foreground mb-6">
            <p>{movie.description}</p>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2 font-headline">Resumo da IA</h2>
            <AiSummary movie={{
                title: movie.title,
                description: movie.description,
                genre: movie.genre,
                cast: "N/A" // Informação de elenco não disponível da IA de recomendação
            }} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 font-headline">Por que recomendamos</h2>
            <p className="text-muted-foreground">{movie.similarityReason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-1">
                    <Skeleton className="aspect-[2/3] w-full max-w-sm mx-auto rounded-lg" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-12 w-3/4 rounded-md" />
                    <Skeleton className="h-20 w-full rounded-md" />
                    <div className="bg-card p-4 rounded-lg border">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
