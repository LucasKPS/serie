"use client";

import { useEffect, useState } from "react";
import { summarizeMovieDetails, type SummarizeMovieDetailsInput } from "@/ai/flows/summarize-movie-details";
import { Skeleton } from "@/components/ui/skeleton";

type AiSummaryProps = {
  movie: SummarizeMovieDetailsInput;
};

export default function AiSummary({ movie }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSummary() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await summarizeMovieDetails(movie);
        setSummary(result.summary);
      } catch (e) {
        console.error("Falha ao obter o resumo da IA:", e);
        setError("Não foi possível gerar o resumo.");
      } finally {
        setIsLoading(false);
      }
    }
    getSummary();
  }, [movie]);

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }

  return <p className="text-sm text-muted-foreground">{summary}</p>;
}
