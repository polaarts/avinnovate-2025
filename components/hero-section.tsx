"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Music, Film, Trophy, Theater, Users, Sparkles } from "lucide-react"

const categories = [
  { id: "musica", name: "Música", icon: Music, count: "12,420 eventos", color: "text-blue-600" },
  { id: "cine", name: "Cine", icon: Film, count: "8,750 eventos", color: "text-purple-600" },
  { id: "deportes", name: "Deportes", icon: Trophy, count: "5,680 eventos", color: "text-red-600" },
  { id: "teatro", name: "Teatro", icon: Theater, count: "3,240 eventos", color: "text-pink-600" },
  { id: "festivales", name: "Festivales", icon: Users, count: "2,890 eventos", color: "text-green-600" },
]

export default function HeroSection() {
  return (
    <section className="relative mb-12 bg-primary overflow-visible pb-24 md:pb-32">
      {/* Background decoration - más sutil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20 flex flex-col items-center justify-center text-center">
        {/* Content Section */}
        <div className="w-full flex flex-col items-center z-10">
          {/* Título reducido 25% */}
          <h1
            className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-6 md:mb-8 text-balance leading-tight animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Vive Experiencias Inolvidables
          </h1>

          {/* Barra de búsqueda mejorada */}
          <div 
            className="w-full max-w-2xl mb-4 md:mb-5 animate-fade-in px-2 md:px-0" 
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative flex gap-2 md:gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Busca eventos, artistas o lugares..."
                  className="w-full pl-11 md:pl-14 pr-4 md:pr-5 py-4 md:py-5 text-base md:text-lg rounded-xl bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-accent"
                />
                <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Botones diferenciados */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-3 justify-center w-full max-w-2xl px-2 md:px-0">
            {/* Botón primario - más prominente */}
            <Button 
              className="px-6 md:px-10 py-4 md:py-5 bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] w-full font-semibold text-base md:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 rounded-xl"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" />
              Buscar
            </Button>
            
            {/* Botón secundario - outline style */}
            <Button 
              className="px-6 md:px-10 py-4 md:py-5 bg-primary-foreground text-foreground hover:scale-[1.02] active:scale-[0.98] border-2 border-primary-foreground/20 w-full font-semibold text-base md:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 rounded-xl backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              <span className="hidden md:inline">Utilizar asistente</span>
              <span className="md:hidden">Asistente IA</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Section - Tarjetas mejoradas */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 animate-fade-in" 
            style={{ animationDelay: "1.2s" }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                className="bg-card border border-border/50 hover:border-primary/50 rounded-2xl p-5 md:p-7 flex flex-col items-center justify-center gap-3 md:gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] group relative overflow-hidden"
              >
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Ícono más grande */}
                <category.icon 
                  className={`w-8 h-8 md:w-10 md:h-10 ${category.color} transition-transform duration-300 relative z-10`} 
                />
                
                <div className="text-center relative z-10">
                  <p className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </p>
                  {/* Texto más legible */}
                  <p className="text-xs md:text-sm text-muted-foreground/80 mt-1.5 font-medium">
                    {category.count}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}