
"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Movie, RecommendedMovie } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

type MovieCardProps = {
  movie: Movie | RecommendedMovie;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  className?: string;
  index?: number;
};

const NetflixLogoN = () => (
  <svg
    width="18"
    height="34"
    viewBox="0 0 18 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-lg"
  >
    <path
      d="M17.436 33.444H12.648L12.42 21.438L5.598 33.444H0.576V0.558002H5.364V12.798L12.186 0.558002H17.208V33.444H17.436Z"
      fill="#E50914"
    />
  </svg>
);

export function MovieCard({
  movie,
  onSelect,
  isSelected,
  className,
  index,
}: MovieCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(movie.id);
    }
  };

  return (
    <Card
      className={cn(
        "group relative block h-full w-full cursor-pointer overflow-hidden rounded-lg border-2 bg-card transition-all duration-300",
        isSelected
          ? "border-accent"
          : "border-transparent hover:border-accent",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[2/3] w-full">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            width={500}
            height={750}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={movie.aiHint}
          />
        </div>

        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-300">
            <CheckCircle2 className="h-16 w-16 text-accent" />
          </div>
        )}

        {index !== undefined && onSelect && (
          <>
            <div className="absolute bottom-2 left-2">
              <NetflixLogoN />
            </div>
            <span className="absolute bottom-2 right-2 text-lg font-bold text-white mix-blend-difference">
              {index + 1}
            </span>
          </>
        )}

        {!onSelect && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-8">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              {movie.title}
            </h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
