"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Clapperboard, Home, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/firebase/auth/use-user";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("search") as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

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
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Início
            </Link>
            <Link
              href="/preferences"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Preferências
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-4">
                <Link
                  href="/home"
                  className="mr-6 flex items-center space-x-2 mb-8"
                >
                  <Clapperboard className="h-6 w-6 text-accent" />
                  <span className="font-bold font-headline">CineScope</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/home"
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                  >
                    <Home className="h-5 w-5" />
                    <span>Início</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                  >
                    <User className="h-5 w-5" />
                    <span>Perfil</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Buscar filmes ou séries..."
                className="pl-9"
                defaultValue={searchParams.get("q") || ""}
              />
            </div>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Avatar'} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

    