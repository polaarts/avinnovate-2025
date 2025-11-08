"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useEffect, useState } from "react"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const getServiceFee = useCartStore((state) => state.getServiceFee)
  const getTotal = useCartStore((state) => state.getTotal)

  const subtotal = getSubtotal()
  const serviceFee = getServiceFee()
  const total = getTotal()
  const totalItems = getTotalItems()

  // Prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
              <span className="text-muted-foreground">({items.length} items)</span>
            </div>

            {items.length === 0 ? (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-6">
                  Explora nuestros eventos y agrega algunos tickets a tu carrito
                </p>
                <Link href="/">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Explorar Eventos
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-muted"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-muted"
                              onClick={() => increaseQuantity(item.id)}
                            >
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
            )}
          </div>

          {/* Resumen del pedido */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} tickets)</span>
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
