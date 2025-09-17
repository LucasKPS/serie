"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
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
  { src: "https://images3.alphacoders.com/129/thumb-1920-1296372.jpg", alt: "Série Dexter", hint: "Dexter series", positionClass: "object-[50%_20%]" },
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
  const { toast } = useToast()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSigningUp, setIsSigningUp] = React.useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
            title: "Account Created",
            description: "You have successfully created an account. Please log in.",
        });
        setIsSigningUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        router.push("/preferences")
      }
    } catch (error: any) {
        console.error(error)
      toast({
        title: "Authentication Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
           <form onSubmit={handleAuth}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{isSigningUp ? "Create Account" : "CineScope"}</CardTitle>
              <CardDescription>
                {isSigningUp ? "Create an account to get started." : "Enter your email below to log in to your account."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" type="submit" disabled={isLoading}>
                 {isLoading ? <Loader2 className="animate-spin" /> : (isSigningUp ? "Sign Up" : "Log In")}
              </Button>
               <div className="text-center text-sm">
                {isSigningUp ? "Already have an account?" : "Don't have an account?"}{' '}
                <Button variant="link" type="button" onClick={() => setIsSigningUp(!isSigningUp)} className="underline p-0 h-auto">
                  {isSigningUp ? "Log In" : "Sign Up"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
