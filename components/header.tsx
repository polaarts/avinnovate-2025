"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Ticket className="w-6 h-6" />
          TicketHub
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#eventos" className="text-sm font-medium hover:text-primary transition">
            Eventos
          </Link>
          <Link href="#categorias" className="text-sm font-medium hover:text-primary transition">
            Categorías
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition">
            Sobre Nosotros
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Ingresar
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Registrarse
          </Button>
        </div>
      </div>
    </header>
  )
}
