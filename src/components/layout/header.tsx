"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Clapperboard, Home, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("search") as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-accent" />
            <span className="font-bold font-headline">CineScope</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/home"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            <Link
              href="/profile"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Profile
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <div className="p-4">
                 <Link href="/home" className="mr-6 flex items-center space-x-2 mb-8">
                    <Clapperboard className="h-6 w-6 text-accent" />
                    <span className="font-bold font-headline">CineScope</span>
                  </Link>
                <nav className="flex flex-col space-y-4">
                   <Link href="/home" className="flex items-center space-x-2">
                     <Home className="h-5 w-5" />
                     <span>Home</span>
                   </Link>
                   <Link href="/profile" className="flex items-center space-x-2">
                     <User className="h-5 w-5" />
                     <span>Profile</span>
                   </Link>
                 </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <form onSubmit={handleSearch} className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search movies or series..."
                className="pl-9"
                defaultValue={searchParams.get("q") || ""}
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
