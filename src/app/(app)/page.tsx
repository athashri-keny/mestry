'use client'

import * as React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'

import messages from '../messages.json'



function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-300">
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 4000 })]}
        className="w-full max-w-2xl"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className="p-4">
              <Card className="bg-gray-700 shadow-xl rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="text-white text-xl font-semibold border-b border-gray-600 p-4">
                  {message.title}
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <p className="text-base text-gray-200">{message.content}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </main>
  )
}

export default Home
