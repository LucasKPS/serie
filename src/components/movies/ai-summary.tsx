
"use client";

import { useState } from "react";
import { summarizeMovieDetails, type SummarizeMovieDetailsInput } from "@/ai/flows/summarize-movie-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type AiSummaryProps = {
  movie: SummarizeMovieDetailsInput;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
};

export default function AiSummary({ movie, isGenerating, setIsGenerating }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getSummary = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await summarizeMovieDetails(movie);
      setSummary(result.summary);
    } catch (e) {
      console.error("Falha ao obter o resumo da IA:", e);
      setError("Não foi possível gerar o resumo. Tente novamente mais tarde.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (summary) {
    return <p className="text-sm text-muted-foreground">{summary}</p>;
  }

  if (isGenerating && !summary && !error) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }

  return (
    <Button onClick={getSummary} disabled={isGenerating} variant="outline" size="sm">
      <Sparkles className="mr-2 h-4 w-4" />
      Gerar Resumo
    </Button>
  );
}
