import PreferencesGrid from "@/components/movies/preferences-grid";

export default function PreferencesPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
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
