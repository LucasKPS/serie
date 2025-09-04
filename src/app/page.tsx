"use client"

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

const backgroundImages = [
  { src: "https://picsum.photos/1920/1080?random=1", hint: "movie collage" },
  { src: "https://picsum.photos/1920/1080?random=2", hint: "action scene" },
  { src: "https://picsum.photos/1920/1080?random=3", hint: "fantasy world" },
  { src: "https://picsum.photos/1920/1080?random=4", hint: "sci-fi city" },
  { src: "https://picsum.photos/1920/1080?random=5", hint: "drama portrait" },
]

export default function LoginPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Carousel
          className="w-full h-full"
          plugins={[plugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {backgroundImages.map((img, index) => (
              <CarouselItem key={index}>
                <Image
                  src={img.src}
                  alt="Collage of famous movies and series"
                  fill
                  className="object-cover"
                  data-ai-hint={img.hint}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>
      <Card className="w-full max-w-sm z-10 bg-card/80">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center mb-4">
            <Clapperboard className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-3xl font-headline">Bem-vindo de volta!</CardTitle>
          <CardDescription>Faça login para continuar no CineScope</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/preferences" className="w-full h-full flex items-center justify-center">Login</Link>
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="#" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
