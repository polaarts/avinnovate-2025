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
  const isLoading = useCartStore((state) => state.isLoading)
  const initializeCart = useCartStore((state) => state.initializeCart)
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

  // Prevent hydration mismatch and initialize cart
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Initialize cart from API
  useEffect(() => {
    if (mounted) {
      initializeCart()
    }
  }, [mounted, initializeCart])

  if (!mounted || isLoading) {
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
                {items.map((item) => {
                  console.log('Item:', item.title, 'isReserved:', item.isReserved)
                  return (
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
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                              {item.category}
                            </span>
                            {item.isReserved && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                                </svg>
                                Reservado
                              </span>
                            )}
                          </div>
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
              )
                })}
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
