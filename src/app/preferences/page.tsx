
"use client"

import Link from "next/link";
import { LogOut } from "lucide-react";
import PreferencesGrid from "@/components/movies/preferences-grid";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function PreferencesPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
      router.push("/auth");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <main className="container mx-auto px-4 py-8 md:py-16 relative">
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 md:top-8 md:right-8 h-12 w-12 bg-card rounded-full flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 border"
        aria-label="Sair"
      >
        <LogOut className="h-6 w-6 text-foreground" />
      </button>
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Bem-vindo ao CineScope
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Para começar, selecione alguns filmes ou séries que você gostou. Isso nos ajudará a criar recomendações personalizadas para você.
        </p>
      </div>
      <PreferencesGrid />
    </main>
  );
}

    