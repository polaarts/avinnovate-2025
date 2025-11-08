"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Clock } from "lucide-react"

interface Event {
  id: string
  title: string
  artist: string
  date: string
  time: string
  location: string
  image: string
  category: string
  price: number
  originalPrice?: number
}

const featuredEvents: Event[] = [
  {
    id: "1",
    title: "Concierto de Verano",
    artist: "The Midnight Echoes",
    date: "15 Dic 2024",
    time: "20:00",
    location: "Estadio Principal",
    image: "/concert-stage-lights.png",
    category: "Música",
    price: 89.99,
    originalPrice: 120,
  },
  {
    id: "2",
    title: "Obra Teatral Clásica",
    artist: "Teatro Nacional",
    date: "22 Dic 2024",
    time: "19:30",
    location: "Teatro Gran Vía",
    image: "/theater-stage-dramatic-lighting.jpg",
    category: "Teatro",
    price: 45.0,
  },
  {
    id: "3",
    title: "Campeonato de Fútbol",
    artist: "Liga Profesional",
    date: "28 Dic 2024",
    time: "17:00",
    location: "Estadio Metropolitano",
    image: "/soccer-football-stadium.jpg",
    category: "Deportes",
    price: 65.0,
    originalPrice: 85,
  },
  {
    id: "4",
    title: "Festival de Artes",
    artist: "Multi-artistas",
    date: "5 Ene 2025",
    time: "10:00",
    location: "Centro de Exposiciones",
    image: "/art-gallery-colorful-paintings.jpg",
    category: "Arte",
    price: 35.0,
  },
]

export default function FeaturedEvents() {
  return (
    <section id="eventos" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Eventos Destacados</h2>
            <p className="text-muted-foreground">Los mejores eventos que no puedes perderte</p>
          </div>
          <Button className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90">Ver todos</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {event.category}
                </div>
                {event.originalPrice && (
                  <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    -{Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)}%
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">{event.artist}</p>
                <h3 className="font-bold text-lg text-foreground mb-4 line-clamp-2">{event.title}</h3>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">${event.price}</span>
                    {event.originalPrice && (
                      <span className="text-sm line-through text-muted-foreground">${event.originalPrice}</span>
                    )}
                  </div>
                </div>

                <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Comprar</Button>
              </div>
            </Card>
          ))}
        </div>

        <Button className="w-full md:hidden mt-8 bg-primary text-primary-foreground hover:bg-primary/90 py-6">
          Ver todos los eventos
        </Button>
      </div>
    </section>
  )
}
