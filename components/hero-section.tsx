"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-primary via-primary/80 to-primary/60 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center min-h-[600px]">
        <div className="mb-8 animate-fade-in">
          <span className="inline-block px-4 py-2 bg-primary-foreground/20 text-primary-foreground rounded-full text-sm font-semibold backdrop-blur">
            🎉 Descubre miles de eventos
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 text-balance leading-tight animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Vive Experiencias Inolvidables
        </h1>

        <p
          className="text-xl md:text-2xl text-primary-foreground/90 mb-12 max-w-2xl text-balance animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          Encuentra y compra tickets para conciertos, teatro, deportes, festivales y mucho más
        </p>

        <div className="w-full max-w-2xl mb-12 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="relative flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Busca eventos, artistas o lugares..."
                className="w-full pl-12 pr-4 py-4 text-base rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Buscar</Button>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-8 text-primary-foreground/80 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold">50K+</p>
            <p className="text-sm">Eventos disponibles</p>
          </div>
          <div className="w-px h-12 bg-primary-foreground/20 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-2xl font-bold">1M+</p>
            <p className="text-sm">Usuarios satisfechos</p>
          </div>
          <div className="w-px h-12 bg-primary-foreground/20 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-sm">Soporte disponible</p>
          </div>
        </div>
      </div>
    </section>
  )
}
