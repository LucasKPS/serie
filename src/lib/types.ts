
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

export interface UserRecommendation {
    id: string;
    userId: string;
    movieId: string | null;
    seriesId: string | null;
    reason: string;
    recommendationDate: string;
    title: string;
    posterUrl: string;
    genre: string;
}

export interface UserPreference {
    id: string;
    userId: string;
    movieId: string | null;
    seriesId: string | null;
    preferenceType: 'watchlist' | 'liked' | 'disliked';
    createdAt: string;
    // Denormalized data for easy display
    title: string;
    posterUrl: string;
    genre: string;
}
