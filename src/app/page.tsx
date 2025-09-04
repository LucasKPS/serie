import PreferencesGrid from "@/components/movies/preferences-grid";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Welcome to CineScope
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          To get started, please select a few movies or series you've enjoyed. This will help us tailor recommendations just for you.
        </p>
      </div>
      <PreferencesGrid />
    </main>
  );
}
