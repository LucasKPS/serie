import Link from "next/link";
import { User } from "lucide-react";
import PreferencesGrid from "@/components/movies/preferences-grid";

export default function PreferencesPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16 relative">
      <Link
        href="/"
        passHref
        className="absolute top-4 right-4 md:top-8 md:right-8 h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110"
        aria-label="Voltar para o Login"
      >
        <User className="h-6 w-6 text-primary" />
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
