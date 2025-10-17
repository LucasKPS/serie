
"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

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
import { useToast } from "@/hooks/use-toast"

const backgroundImages = [
  { src: "https://images.alphacoders.com/129/thumb-1920-1296363.jpg", alt: "Série Dexter", hint: "Dexter series", positionClass: "object-[50%_20%]" },
  { src: "https://picfiles.alphacoders.com/424/thumb-1920-424862.jpg", alt: "Série Flash", hint: "The Flash series" },
  { src: "https://4kwallpapers.com/images/wallpapers/la-casa-de-papel-tv-5120x2880-18748.jpg", alt: "Série La Casa de Papel", hint: "La Casa de Papel" },
  { src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNRI75j_QUacc6WcMQgEdgbCBr5cVcm92phEvSkDLqTHefLPJh6xIMWfnaYCVSplw3602IXXchyphenhyphendcu5CPif-5PXVMtKP-fVqNMrinfY8Z2PfhSxXCpbQHD2o38woObq6NOu-DMUXB9OozF4_DiLT1IFWHVzv5wE8RT7PwUxvZoqLjRKWYJ8xpQwUAxQIy6/s16000/alice-in-borderlands-capa-2.jpg", alt: "Série Alice in Borderland", hint: "Alice in Borderland" },
  { src: "https://www.slashgear.com/img/gallery/netflix-brings-breaking-bad-in-4k/intro-import.jpg", alt: "Série Breaking Bad", hint: "Breaking Bad" }
]

export default function LoginPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  )
  const router = useRouter()
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/preferences");
  };


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
                Digite seu e-mail abaixo para entrar na sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@exemplo.com" required />
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
                <Button variant="link" type="button" className="underline p-0 h-auto">
                  Cadastre-se
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
