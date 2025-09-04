export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  cast: string[];
  posterUrl: string;
  rating: number;
  year: number;
  aiHint: string;
}

export interface RecommendedMovie {
  id: string;
  title: string;
  description: string;
  genre: string;
  similarityReason: string;
  posterUrl: string;
  aiHint: string;
}
