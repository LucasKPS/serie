
"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { RecommendedMovie, UserPreference } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/firebase";
import { collection, deleteDoc, doc, setDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Bookmark } from "lucide-react";

// Envolvemos o componente em um componente pai para usar React.use()
function MovieDetails({ slug }: { slug: string }) {
  const [movie, setMovie] = useState<RecommendedMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistDocId, setWatchlistDocId] = useState<string | null>(null);

  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadMovieAndWatchlist() {
      if (!user || !firestore) return;

      try {
        const storedRecs = localStorage.getItem("recommendations");
        let foundMovie: RecommendedMovie | undefined;
        if (storedRecs) {
          const parsedRecs: RecommendedMovie[] = JSON.parse(storedRecs);
          foundMovie = parsedRecs.find(m => m.id === slug);
        }

        if (foundMovie) {
          setMovie(foundMovie);

          // Check watchlist status
          const q = query(
            collection(firestore, 'users', user.uid, 'userPreferences'),
            where('movieId', '==', foundMovie.id),
            where('preferenceType', '==', 'watchlist')
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setIsInWatchlist(true);
            setWatchlistDocId(querySnapshot.docs[0].id);
          } else {
            setIsInWatchlist(false);
            setWatchlistDocId(null);
          }
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Falha ao carregar os dados do filme", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }
    loadMovieAndWatchlist();
  }, [slug, user, firestore]);

  const handleWatchlistToggle = async () => {
    if (!user || !firestore || !movie) return;

    if (isInWatchlist && watchlistDocId) {
      // Remove from watchlist
      const docRef = doc(firestore, 'users', user.uid, 'userPreferences', watchlistDocId);
      await deleteDoc(docRef);
      setIsInWatchlist(false);
      setWatchlistDocId(null);
      toast({ title: 'Removido da sua lista!' });
    } else {
      // Add to watchlist
      const newDocRef = doc(collection(firestore, 'users', user.uid, 'userPreferences'));
      const preference: UserPreference = {
        id: newDocRef.id,
        userId: user.uid,
        movieId: movie.id,
        seriesId: null,
        preferenceType: 'watchlist',
        createdAt: new Date().toISOString(),
        title: movie.title,
        posterUrl: movie.posterUrl,
        genre: movie.genre
      };
      await setDoc(newDocRef, preference);
      setIsInWatchlist(true);
      setWatchlistDocId(newDocRef.id);
      toast({ title: 'Adicionado à sua lista!' });
    }
  };


  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!movie) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] w-full max-w-sm mx-auto sticky top-24">
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
          
          <Button onClick={handleWatchlistToggle} size="lg">
             <Bookmark className={`mr-2 h-5 w-5 ${isInWatchlist ? 'fill-current' : ''}`} />
            {isInWatchlist ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
          </Button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 font-headline">Por que recomendamos</h2>
            <p className="text-muted-foreground">{movie.similarityReason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <MovieDetails slug={slug} />;
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
                    <Skeleton className="h-10 w-48 mt-4" />
                    <div className="bg-card p-4 rounded-lg border mt-8">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
