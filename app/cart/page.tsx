"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"

interface CartItem {
  id: string
  title: string
  artist: string
  date: string
  time: string
  location: string
  image: string
  price: number
  quantity: number
  category: string
}

// Items mockeados del carrito
const mockCartItems: CartItem[] = [
  {
    id: "1",
    title: "Concierto de Verano",
    artist: "The Midnight Echoes",
    date: "15 Dic 2024",
    time: "20:00",
    location: "Estadio Principal",
    image: "/concert-stage-lights.png",
    price: 89.99,
    quantity: 2,
    category: "Música",
  },
  {
    id: "2",
    title: "Obra Teatral Clásica",
    artist: "Teatro Nacional",
    date: "22 Dic 2024",
    time: "19:30",
    location: "Teatro Gran Vía",
    image: "/theater-stage-dramatic-lighting.jpg",
    price: 45.0,
    quantity: 1,
    category: "Teatro",
  },
  {
    id: "3",
    title: "Campeonato de Fútbol",
    artist: "Liga Profesional",
    date: "28 Dic 2024",
    time: "17:00",
    location: "Estadio Metropolitano",
    image: "/soccer-football-stadium.jpg",
    price: 65.0,
    quantity: 4,
    category: "Deportes",
  },
]

export default function CartPage() {
  const subtotal = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const serviceFee = subtotal * 0.1 // 10% comisión de servicio
  const total = subtotal + serviceFee

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a inicio
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de items del carrito */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Mi Carrito</h1>
              <span className="text-muted-foreground">({mockCartItems.length} items)</span>
            </div>

            <div className="space-y-4">
              {mockCartItems.map((item) => (
                <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Imagen del evento */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Información del evento */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-2">
                            {item.category}
                          </span>
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.artist}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                        <div className="text-sm text-muted-foreground">
                          <p>{item.date} • {item.time}</p>
                          <p>{item.location}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Cantidad */}
                          <div className="flex items-center gap-2 border border-border rounded-lg">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({mockCartItems.reduce((acc, item) => acc + item.quantity, 0)} tickets)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comisión de servicio</span>
                  <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3">
                Proceder al Pago
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Nota:</strong> Los tickets se enviarán a tu correo electrónico después de completar la compra.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
