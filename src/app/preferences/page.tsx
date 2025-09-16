import Link from "next/link";
import { UserCircle } from "lucide-react";
import PreferencesGrid from "@/components/movies/preferences-grid";
import { Button } from "@/components/ui/button";

export default function PreferencesPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16 relative">
      <Link href="/" passHref>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 md:top-8 md:right-8 h-10 w-10"
        >
          <UserCircle className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Voltar para o Login</span>
        </Button>
      </Link>
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
