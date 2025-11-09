"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CheckoutSteps from "@/components/checkout-steps"
import OrderSummary from "@/components/order-summary"
import { ArrowLeft, ShoppingBag, User, Mail } from "lucide-react"
import { getItems, getItemsCount, saveSelectedSeat, getSelectedSeat, removeSelectedSeat, type CartItem } from "@/lib/cartStore"

// Datos mockeados de información personal
const mockUserData = {
  firstName: "Javier",
  lastName: "Oberto",
  email: "javier.oberto@gmail.com",
}

export default function CheckoutStep1() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const [formData, setFormData] = useState({
    firstName: mockUserData.firstName,
    lastName: mockUserData.lastName,
    email: mockUserData.email,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setItems(getItems())
      
      // Guardar datos mockeados en localStorage al cargar
      const personalData = {
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        email: mockUserData.email,
      }
      localStorage.setItem("checkoutPersonalData", JSON.stringify(personalData))
      
      // Cargar asiento seleccionado guardado (si existe)
      let savedSeat = getSelectedSeat()
      if (!savedSeat && typeof window !== "undefined") {
        try {
          const rawSel = localStorage.getItem("cart:selectedSeat")
          if (rawSel) savedSeat = JSON.parse(rawSel)
        } catch {}
      }
      if (savedSeat && savedSeat.id) {
        setSelectedSeats([savedSeat.id])
      } else {
        setSelectedSeats([])
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Listeners para actualizar UI en tiempo real
  useEffect(() => {
    function handleCartChanged() {
      setItems(getItems())
    }

    function handleSelectedChanged(ev: Event) {
      const detail = (ev as CustomEvent).detail as { id?: string } | null
      if (!detail || !detail.id) {
        setSelectedSeats([])
        return
      }

      setSelectedSeats((prev) => {
        const currentLimit = getItemsCount()
        if (prev.includes(detail.id!)) return prev
        if (prev.length < currentLimit) return [...prev, detail.id!]
        return [detail.id!]
      })
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cart:changed", handleCartChanged)
      window.addEventListener("cart:selectedChanged", handleSelectedChanged as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:changed", handleCartChanged)
        window.removeEventListener("cart:selectedChanged", handleSelectedChanged as EventListener)
      }
    }
  }, [])

  const totalItems = getItemsCount()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field]: value,
      }
      
      const personalData = {
        firstName: newFormData.firstName,
        lastName: newFormData.lastName,
        email: newFormData.email,
      }
      localStorage.setItem("checkoutPersonalData", JSON.stringify(personalData))
      
      return newFormData
    })
  }

  const handleSeatClick = (seatId: string, isAvailable: boolean) => {
    if (!isAvailable) return

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        const next = prev.filter((id) => id !== seatId)
        const saved = getSelectedSeat()
        if (saved && saved.id === seatId) removeSelectedSeat()
        return next
      }

      if (prev.length < totalItems) {
        saveSelectedSeat({ id: seatId, name: seatId, quantity: 1 })
        return [...prev, seatId]
      }
      return prev
    })
  }

  const validateStep = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      selectedSeats.length === totalItems
    )
  }

  const handleContinue = () => {
    if (validateStep()) {
      // Guardar asientos seleccionados en localStorage
      localStorage.setItem("checkoutSelectedSeats", JSON.stringify(selectedSeats))
      router.push("/checkout/2")
    }
  }

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some events before proceeding to checkout
            </p>
            <Link href="/">
              <Button>Explore Events</Button>
            </Link>
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
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>

        {/* Indicador de pasos */}
        <CheckoutSteps currentStep={1} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Información Personal */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-main" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name *</label>
                      <Input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name *</label>
                      <Input
                        type="text"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex text-sm font-semibold mb-2 items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="john.smith@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You will receive your tickets at this email
                    </p>
                  </div>
                </div>
              </Card>

              {/* Selección de Asientos */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Select your Seats</h2>
                <p className="text-sm text-foreground/70 mb-6">
                  Select {totalItems} seat{totalItems > 1 ? 's' : ''} for your purchase.
                </p>

                {/* Pantalla/Escenario */}
                <div className="mb-6">
                  <div className="w-full h-2 bg-main border-2 border-border rounded-base mb-2" />
                  <p className="text-center text-xs font-bold text-foreground/60">STAGE</p>
                </div>

                {/* Matriz de asientos */}
                <div className="space-y-2 mb-6">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-sm font-bold text-center">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center flex-wrap">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                          const seatId = `${row}${num}`
                          const isAvailable = row === 'A' || row === 'B'
                          const isSelected = selectedSeats.includes(seatId)
                          
                          return (
                            <button
                              key={seatId}
                              onClick={() => handleSeatClick(seatId, isAvailable)}
                              disabled={!isAvailable}
                              className={`w-8 h-8 text-xs font-bold border-2 border-border rounded-base transition-all ${
                                isSelected
                                  ? 'bg-main text-main-foreground shadow-shadow'
                                  : isAvailable
                                  ? 'bg-secondary-background hover:bg-main/20 hover:scale-110'
                                  : 'bg-foreground/20 cursor-not-allowed opacity-40'
                              }`}
                              title={seatId}
                            >
                              {num}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Leyenda */}
                <div className="flex flex-wrap gap-4 text-xs mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-secondary-background border-2 border-border rounded-base" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-main border-2 border-border rounded-base" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-foreground/20 border-2 border-border rounded-base opacity-40" />
                    <span>Not available</span>
                  </div>
                </div>

                {/* Asientos seleccionados */}
                {selectedSeats.length > 0 && (
                  <div className="p-4 bg-main/10 border-2 border-border rounded-base">
                    <p className="font-bold mb-2">Selected seats:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <span key={seat} className="px-3 py-1 bg-main text-main-foreground text-sm font-bold rounded-base border-2 border-border">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={handleContinue}
                  disabled={!validateStep()}
                  className="flex-1"
                >
                  Continue to Payment
                  {selectedSeats.length < totalItems && (
                    <span className="ml-2">({selectedSeats.length}/{totalItems})</span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
