'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase/auth/use-user";
import { Film, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
              <History className="w-6 h-6" />
              Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Seu histórico de visualização ainda não está disponível. Esta funcionalidade chegará em breve!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-6 h-6" />
              Minha Lista
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">
              Você pode gerenciar sua lista pessoal de filmes e séries para assistir aqui. Esta funcionalidade chegará em breve!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    