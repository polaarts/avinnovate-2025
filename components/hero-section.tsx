"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative min-h-[300px] bg-gradient-to-br from-primary via-primary/80 to-primary/60 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[600px] h-[500px]">
        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          

          <h1
            className="text-5xl md:text-7xl font-extrabold text-primary-foreground mb-6 text-balance leading-tight animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Vive Experiencias Inolvidables
          </h1>

          <div className="w-full max-w-2xl mb-4 animate-fade-in px-2 md:px-0" style={{ animationDelay: "0.6s" }}>
            <div className="relative flex gap-2 md:gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Busca eventos, artistas o lugares..."
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 text-sm md:text-base rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0"
                />
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </div>
            </div>

          </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-2 justify-center w-full max-w-2xl px-2 md:px-0">
              <Button className="px-4 md:px-8 py-3 md:py-4 bg-accent text-accent-foreground hover:bg-accent/90 w-full font-semibold text-sm md:text-base">Buscar</Button>
              <Button className="px-4 md:px-8 py-3 md:py-4 bg-accent text-accent-foreground hover:bg-accent/90 w-full font-semibold text-sm md:text-base flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                </svg>
                <span className="hidden md:inline">Utilizar asistente</span>
                <span className="md:hidden">Asistente</span>
              </Button>
            </div>

        </div>

        {/* Image Section - Oculta en dispositivos pequeños */}
        <div className="flex-1 hidden lg:block relative w-full animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="relative w-full h-[300px] lg:h-[1000px] mt-[50px]">
            <Image
              src="/avatar.png"
              alt="Hero Avatar"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}