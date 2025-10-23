
"use client";

import { useState } from "react";
import { summarizeMovieDetails, type SummarizeMovieDetailsInput } from "@/ai/flows/summarize-movie-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type AiSummaryProps = {
  movie: SummarizeMovieDetailsInput;
};

export default function AiSummary({ movie }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeMovieDetails(movie);
      setSummary(result.summary);
    } catch (e) {
      console.error("Falha ao obter o resumo da IA:", e);
      setError("Não foi possível gerar o resumo. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  if (summary) {
    return <p className="text-sm text-muted-foreground">{summary}</p>;
  }

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }

  return (
    <Button onClick={getSummary} disabled={isLoading} variant="outline" size="sm">
      <Sparkles className="mr-2 h-4 w-4" />
      Gerar Resumo
    </Button>
  );
}
