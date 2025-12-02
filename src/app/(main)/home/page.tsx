
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { RecommendedMovie, UserPreference } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { useFirebase } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

function WatchlistButton({ movie }: { movie: RecommendedMovie }) {
    const { firestore, user } = useFirebase();
    const { toast } = useToast();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistDocId, setWatchlistDocId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkWatchlist() {
            if (!user || !firestore) {
                setIsLoading(false);
                return;
            };

            setIsLoading(true);
            const q = query(
                collection(firestore, 'users', user.uid, 'userPreferences'),
                where('movieId', '==', movie.id),
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
            setIsLoading(false);
        }
        checkWatchlist();
    }, [user, firestore, movie.id]);

    const handleWatchlistToggle = async () => {
        if (!user || !firestore) return;

        if (isInWatchlist && watchlistDocId) {
            const docRef = doc(firestore, 'users', user.uid, 'userPreferences', watchlistDocId);
            await deleteDoc(docRef);
            setIsInWatchlist(false);
            setWatchlistDocId(null);
            toast({ title: 'Removido da sua lista!' });
        } else {
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
        return <Skeleton className="h-10 w-48" />;
    }

    return (
        <Button onClick={handleWatchlistToggle} variant="outline">
            <Bookmark className={`mr-2 h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            {isInWatchlist ? 'Remover da Lista' : 'Adicionar à Lista'}
        </Button>
    );
}

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          <Link href="/preferences">Obter Recomendações</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">Suas Recomendações</h1>
        <p className="text-lg text-muted-foreground">Com base nas suas preferências, aqui estão algumas sugestões.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/preferences">Gerar Novas Recomendações</Link>
        </Button>
      </div>

      {recommendations.map((movie, index) => (
         <div key={movie.id} className="grid md:grid-cols-3 gap-8 md:gap-12 items-start animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="md:col-span-1">
              <Link href={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] w-full max-w-sm mx-auto group sticky top-24">
                    <Image
                      src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/500/750`}
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
            
            <WatchlistButton movie={movie} />

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2 font-headline">Por que recomendamos</h3>
                <p className="text-muted-foreground">{movie.similarityReason}</p>
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
        <div key={i} className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:col-span-1">
                <Skeleton className="aspect-[2/3] w-full max-w-sm mx-auto rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-12 w-3/4 rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                 <Skeleton className="h-10 w-48" />
                 <div className="mt-8">
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}
