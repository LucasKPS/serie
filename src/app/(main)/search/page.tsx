"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';
import Link from "next/link";
import { MovieCard } from "@/components/movies/movie-card";
import { movies } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.cast.some((actor) => actor.toLowerCase().includes(query))
  );

  if (!query) {
    return (
        <div className="text-center py-16">
            <h2 className="text-xl font-semibold">Procure por um filme ou série</h2>
            <p className="text-muted-foreground">Use a barra de pesquisa no cabeçalho para encontrar o que você está procurando.</p>
        </div>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">
        Resultados para "{query}"
      </h1>
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">Nenhum resultado encontrado</h2>
          <p className="text-muted-foreground">
            Não conseguimos encontrar nenhum filme ou série que corresponda à sua pesquisa.
          </p>
        </div>
      )}
    </>
  );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-9 w-1/3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] w-full" />)}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<LoadingSkeleton />}>
                <SearchResults />
            </Suspense>
        </div>
    )
}
