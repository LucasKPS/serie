"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const backgroundImages = [
  { src: "https://picsum.photos/1920/1080?random=10", alt: "Movie Scene 1", hint: "action movie" },
  { src: "https://picsum.photos/1920/1080?random=11", alt: "Movie Scene 2", hint: "fantasy landscape" },
  { src: "https://picsum.photos/1920/1080?random=12", alt: "Movie Scene 3", hint: "sci-fi city" },
  { src: "https://picsum.photos/1920/1080?random=13", alt: "Movie Scene 4", hint: "drama portrait" },
  { src: "https://picsum.photos/1920/1080?random=14", alt: "Movie Scene 5", hint: "animated world" },
]

export default function LoginPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-screen"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {backgroundImages.map((img, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-screen relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={img.hint}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </main>
  )
}
