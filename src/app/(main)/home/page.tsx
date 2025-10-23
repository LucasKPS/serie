
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { RecommendedMovie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import AiSummary from "@/components/movies/ai-summary";

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    try {
      const storedRecs = localStorage.getItem("recommendations");
      if (storedRecs) {
        const parsedRecs: RecommendedMovie[] = JSON.parse(storedRecs);
        setRecommendations(parsedRecs);
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
    <div className="container mx-auto px-4 py-8 space-y-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">Suas Recomendações</h1>
        <p className="text-lg text-muted-foreground">Com base nas suas preferências, aqui estão algumas sugestões.</p>
      </div>

      {recommendations.map((movie, index) => (
         <div key={movie.id} className="grid md:grid-cols-3 gap-8 md:gap-12 items-start animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="md:col-span-1">
              <Link href={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] w-full max-w-sm mx-auto group">
                    <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="rounded-lg object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={movie.aiHint}
                    />
                </div>
              </Link>
            </div>
            <div className="md:col-span-2">
            <Badge variant="secondary" className="mb-2">{movie.genre}</Badge>
            <Link href={`/movie/${movie.id}`}>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline hover:text-accent transition-colors">{movie.title}</h2>
            </Link>
            
            <div className="prose prose-invert max-w-none text-muted-foreground mb-6">
                <p>{movie.description}</p>
            </div>
            
            <div className="bg-card p-4 rounded-lg border mb-6">
                <h3 className="text-xl font-semibold mb-2 font-headline">Resumo da IA</h3>
                <AiSummary 
                    movie={{
                        title: movie.title,
                        description: movie.description,
                        genre: movie.genre,
                        cast: "N/A"
                    }}
                    isGenerating={isGeneratingSummary}
                    setIsGenerating={setIsGeneratingSummary}
                />
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2 font-headline">Por que recomendamos</h3>
                <p className="text-muted-foreground font-headline">{movie.similarityReason}</p>
            </div>
            </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {[1, 2, 3].map(i => (
        <div key={i} className="grid md:grid-cols-3 gap-8 md:gap-12">
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
      ))}
    </div>
  );
}
