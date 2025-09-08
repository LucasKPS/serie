"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const backgroundImages = [
  { src: "/DEXTER.PNG", alt: "Série Dexter", hint: "Dexter series", positionClass: "object-[50%_40%]" },
  { src: "https://images5.alphacoders.com/840/thumb-1920-840870.jpg", alt: "Série Flash", hint: "Flash series" },
  { src: "https://4kwallpapers.com/images/wallpapers/one-piece-netflix-3840x2160-12664.jpg", alt: "Série One Piece", hint: "One Piece anime" },
  { src: "https://4kwallpapers.com/images/wallpapers/la-casa-de-papel-tv-5120x2880-18748.jpg", alt: "Série La Casa de Papel", hint: "La Casa de Papel" },
  { src: "https://www.slashgear.com/img/gallery/netflix-brings-breaking-bad-in-4k/intro-import.jpg", alt: "Série Breaking Bad", hint: "Breaking Bad" }
]

export default function LoginPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  )
   const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/preferences")
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-screen"
        opts={{
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
      >
        <CarouselContent>
          {backgroundImages.map((img, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-screen relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className={`object-cover ${img.positionClass || 'object-center'}`}
                  data-ai-hint={img.hint}
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-sm bg-background/80 backdrop-blur-sm">
           <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">CineScope</CardTitle>
              <CardDescription>
                Entre para descobrir suas próximas séries e filmes favoritos.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" type="submit">
                Entrar
              </Button>
               <div className="text-center text-sm">
                Não tem uma conta?{' '}
                <Link href="#" className="underline">
                  Cadastre-se
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
