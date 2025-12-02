
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase/auth/use-user";
import { Film, History, ListVideo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserPreference, UserRecommendation } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { MovieCard } from '@/components/movies/movie-card';

function RecommendationHistory() {
  const { firestore, user } = useFirebase();

  const recommendationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'recommendations'),
      orderBy('recommendationDate', 'desc')
    );
  }, [firestore, user]);

  const { data: recommendations, isLoading } = useCollection<UserRecommendation>(recommendationsQuery);

  if (isLoading) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />)}
        </div>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return (
        <div className='text-center py-8'>
            <p className="text-muted-foreground">Você ainda não tem um histórico de recomendações.</p>
            <Button asChild variant="link" className="mt-2">
                <Link href="/preferences">Gerar novas recomendações</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {recommendations.map(rec => (
            <Link key={rec.id} href={`/movie/${rec.movieId}`}>
                <MovieCard movie={{...rec, posterUrl: rec.posterUrl || ''}} />
            </Link>
        ))}
    </div>
  )
}

function MyWatchlist() {
  const { firestore, user } = useFirebase();

  const watchlistQuery = useMemoFirebase(() => {
    if (!user) return null;
    // Removido o orderBy('createdAt', 'desc') para evitar a necessidade de um índice composto.
    return query(
      collection(firestore, 'users', user.uid, 'userPreferences'),
      where('preferenceType', '==', 'watchlist')
    );
  }, [firestore, user]);

  const { data: watchlistItems, isLoading, error } = useCollection<UserPreference>(watchlistQuery);
  
    if (isLoading) {
      return (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />)}
          </div>
      )
    }

    if (error) {
        return (
             <div className='text-center py-8'>
                <p className="text-destructive">Não foi possível carregar sua lista.</p>
                <p className="text-muted-foreground text-sm">Por favor, tente recarregar a página.</p>
            </div>
        )
    }
  
    if (!watchlistItems || watchlistItems.length === 0) {
      return (
          <div className='text-center py-8'>
              <p className="text-muted-foreground">Sua lista está vazia.</p>
              <Button asChild variant="link" className="mt-2">
                  <Link href="/home">Adicionar filmes e séries</Link>
              </Button>
          </div>
      )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchlistItems.map(item => (
                <Link key={item.id} href={`/movie/${item.movieId}`}>
                   <MovieCard movie={{
                        id: item.movieId!,
                        title: item.title,
                        posterUrl: item.posterUrl,
                        aiHint: item.genre,
                        genre: item.genre,
                        description: '',
                   }} />
                </Link>
            ))}
        </div>
      )
}

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-8 mb-12">
                <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                <div className="text-center md:text-left space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-10 w-32 mt-4" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-48 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />)}
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-8 mb-12">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary">
          <AvatarImage src={user.photoURL || "https://picsum.photos/200"} alt={user.displayName || 'User Avatar'} />
          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold font-headline">{user.displayName || 'Usuário CineScope'}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <Button variant="outline" className="mt-4">
            Editar Perfil
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <ListVideo className="w-6 h-6" />
                Minha Lista
                </CardTitle>
                <CardDescription>
                Filmes e séries que você salvou para assistir mais tarde.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MyWatchlist />
            </CardContent>
            </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-6 h-6" />
              Histórico de Recomendações
            </CardTitle>
            <CardDescription>
                Aqui estão os filmes e séries que meu sistema recomendou para você anteriormente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecommendationHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
