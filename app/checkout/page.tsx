"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowLeft, CreditCard, Lock, CheckCircle, ShoppingBag, User, Mail, Phone } from "lucide-react"
import { getItems, getItemsCount, type CartItem } from "@/lib/cartStore"
import { saveSelectedSeat, getSelectedSeat, removeSelectedSeat } from "@/lib/cartStore";

// Método de pago guardado (mockeado)
const savedPaymentMethod = {
  type: "visa",
  lastDigits: "4242",
  cardName: "JUAN PÉREZ",
  expiryDate: "12/26",
}

// Datos mockeados de información personal
const mockUserData = {
  firstName: "Javier",
  lastName: "Oberto",
  email: "javier.oberto@gmail.com",
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [currentStep, setCurrentStep] = useState(1) // 1: Info + Asientos, 2: Pago, 3: Confirmación
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [useNewPayment, setUseNewPayment] = useState(false)

  // Datos del formulario - inicializados con datos mockeados
  const [formData, setFormData] = useState({
    // Información personal
    firstName: mockUserData.firstName,
    lastName: mockUserData.lastName,
    email: mockUserData.email,
    // Información de pago (para nuevo método)
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
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
      // Cargar asiento seleccionado guardado (si existe) y marcarlo como seleccionado
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

  // Listeners para actualizar UI en tiempo real cuando el store cambia
  useEffect(() => {
    function handleCartChanged() {
      setItems(getItems())
    }

    function handleSelectedChanged(ev: Event) {
      const detail = (ev as CustomEvent).detail as { id?: string } | null
      if (!detail || !detail.id) {
        // Si se elimina la selección desde otra fuente
        setSelectedSeats([])
        return
      }

      setSelectedSeats((prev) => {
        const currentLimit = getItemsCount()
        // Si ya lo teníamos, no hacemos nada
        if (prev.includes(detail.id!)) return prev

        // Si aún caben asientos, añadimos
        if (prev.length < currentLimit) return [...prev, detail.id!]

        // Si no caben, reemplazamos por la nueva selección (guardamos la última)
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

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee
  const totalItems = getItemsCount()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field]: value,
      }
      
      // Guardar información personal en localStorage
      if (["firstName", "lastName", "email", "phone"].includes(field)) {
        const personalData = {
          firstName: newFormData.firstName,
          lastName: newFormData.lastName,
          email: newFormData.email,
        }
        localStorage.setItem("checkoutPersonalData", JSON.stringify(personalData))
      }
      
      return newFormData
    })
  }

  const handleSeatClick = (seatId: string, isAvailable: boolean) => {
    if (!isAvailable) return

    setSelectedSeats((prev) => {
      // Si ya estaba seleccionado -> quitar
      if (prev.includes(seatId)) {
        const next = prev.filter((id) => id !== seatId)
        // Si el asiento deseleccionado era el guardado, eliminar del store
        const saved = getSelectedSeat()
        if (saved && saved.id === seatId) removeSelectedSeat()
        return next
      }

      // Seleccionar (si no excede el límite)
      if (prev.length < totalItems) {
        // Persistir el asiento seleccionado en el store (guardamos el último seleccionado)
        saveSelectedSeat({ id: seatId, name: seatId, quantity: 1 })
        return [...prev, seatId]
      }
      return prev
    })
  }

  const validateStep1 = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      selectedSeats.length === totalItems
    )
  }

  const validateStep2 = () => {
    if (!useNewPayment) return true // Si usa método guardado, siempre válido
    
    return (
      formData.cardNumber.trim() !== "" &&
      formData.cardName.trim() !== "" &&
      formData.expiryDate.trim() !== "" &&
      formData.cvv.trim() !== ""
    )
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      handlePayment()
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Generar número de orden
    const newOrderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
    setOrderNumber(newOrderNumber)
    setIsProcessing(false)
    setCurrentStep(3)
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

  if (items.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">
              Agrega algunos eventos antes de proceder al checkout
            </p>
            <Link href="/">
              <Button>Explorar Eventos</Button>
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
          Volver al carrito
        </Link>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { num: 1, label: "Info & Asientos" },
            { num: 2, label: "Pago" },
            { num: 3, label: "Confirmación" },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 border-border flex items-center justify-center font-bold transition-all ${
                    step.num === currentStep
                      ? "bg-main text-main-foreground shadow-shadow"
                      : step.num < currentStep
                      ? "bg-foreground text-background"
                      : "bg-secondary-background text-foreground"
                  }`}
                >
                  {step.num < currentStep ? <CheckCircle className="w-5 h-5" /> : step.num}
                </div>
                <span className="text-xs mt-1 font-medium">{step.label}</span>
              </div>
              {idx < 2 && (
                <div
                  className={`w-16 md:w-24 h-1 border-2 border-border mb-5 ${
                    step.num < currentStep ? "bg-foreground" : "bg-secondary-background"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de checkout */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Información Personal */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-main" />
                    Información Personal
                  </h2>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Nombre *</label>
                        <Input
                          type="text"
                          placeholder="Juan"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Apellido *</label>
                        <Input
                          type="text"
                          placeholder="Pérez"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex text-sm font-semibold mb-2 items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Correo Electrónico *
                      </label>
                      <Input
                        type="email"
                        placeholder="juan.perez@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recibirás tus tickets en este correo
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Selección de Asientos */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Selecciona tus Asientos</h2>
                  <p className="text-sm text-foreground/70 mb-6">
                    Selecciona {totalItems} asiento{totalItems > 1 ? 's' : ''} para tu compra.
                  </p>

                  {/* Pantalla/Escenario */}
                  <div className="mb-6">
                    <div className="w-full h-2 bg-main border-2 border-border rounded-base mb-2" />
                    <p className="text-center text-xs font-bold text-foreground/60">ESCENARIO</p>
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
                            const IAseat = getSelectedSeat();
                            
                            return (
                              <button
                              
                                key={seatId}  // Si IASeat es valor no nula, marcar como seleccionado
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
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-main border-2 border-border rounded-base" />
                      <span>Seleccionado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-foreground/20 border-2 border-border rounded-base opacity-40" />
                      <span>No disponible</span>
                    </div>
                  </div>

                  {/* Asientos seleccionados */}
                  {selectedSeats.length > 0 && (
                    <div className="p-4 bg-main/10 border-2 border-border rounded-base">
                      <p className="font-bold mb-2">Asientos seleccionados:</p>
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
                    onClick={handleNextStep}
                    disabled={!validateStep1()}
                    className="flex-1"
                  >
                    Continuar al Pago
                    {selectedSeats.length < totalItems && (
                      <span className="ml-2">({selectedSeats.length}/{totalItems})</span>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-main" />
                  Método de Pago
                </h2>

                <div className="space-y-6">
                  {/* Método de pago guardado */}
                  <div>
                    <label className="flex items-center gap-3 p-4 border-2 border-border rounded-base cursor-pointer hover:bg-main/5 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={!useNewPayment}
                        onChange={() => setUseNewPayment(false)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-main" />
                          <span className="font-bold">
                            {savedPaymentMethod.type.toUpperCase()} •••• {savedPaymentMethod.lastDigits}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/70">
                          {savedPaymentMethod.cardName}
                        </p>
                        <p className="text-xs text-foreground/60 mt-1">
                          Expira: {savedPaymentMethod.expiryDate}
                        </p>
                      </div>
                      {!useNewPayment && (
                        <CheckCircle className="w-6 h-6 text-main" />
                      )}
                    </label>
                  </div>

                  {/* Agregar nuevo método de pago */}
                  <div>
                    <label className="flex items-center gap-3 p-4 border-2 border-border rounded-base cursor-pointer hover:bg-main/5 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={useNewPayment}
                        onChange={() => setUseNewPayment(true)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-main" />
                          <span className="font-bold">Agregar nuevo método de pago</span>
                        </div>
                      </div>
                      {useNewPayment && (
                        <CheckCircle className="w-6 h-6 text-main" />
                      )}
                    </label>

                    {/* Formulario de nuevo método de pago */}
                    {useNewPayment && (
                      <div className="mt-4 p-4 border-2 border-border rounded-base space-y-4 bg-secondary-background">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Número de Tarjeta *</label>
                          <Input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            value={formData.cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, "")
                              const formatted = value.match(/.{1,4}/g)?.join(" ") || value
                              handleInputChange("cardNumber", formatted)
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Nombre en la Tarjeta *</label>
                          <Input
                            type="text"
                            placeholder="NOMBRE COMPLETO"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Expiración *</label>
                            <Input
                              type="text"
                              placeholder="MM/AA"
                              maxLength={5}
                              value={formData.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "")
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                }
                                handleInputChange("expiryDate", value)
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">CVV *</label>
                            <Input
                              type="text"
                              placeholder="123"
                              maxLength={4}
                              value={formData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "")
                                handleInputChange("cvv", value)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-main/10 border-2 border-border rounded-base">
                    <div className="flex items-start gap-2">
                      <Lock className="w-5 h-5 text-main mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-sm mb-1">Pago 100% Seguro</p>
                        <p className="text-xs text-foreground/70">
                          Tu información está protegida con encriptación SSL de 256 bits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t-2 border-border">
                  <Button
                    variant="neutral"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!validateStep2() || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Realizar Pago ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="p-8 text-center">
                <div className="w-20 h-20 bg-main rounded-full flex items-center justify-center mx-auto mb-6 shadow-shadow">
                  <CheckCircle className="w-12 h-12 text-main-foreground" />
                </div>

                <h2 className="text-3xl font-bold mb-3">¡Compra Exitosa!</h2>
                <p className="text-lg text-foreground/70 mb-6">
                  Tu orden ha sido confirmada
                </p>

                <div className="bg-main/10 border-2 border-border rounded-base p-6 mb-6">
                  <p className="text-sm font-semibold mb-2">Número de Orden</p>
                  <p className="text-2xl font-bold text-main">
                    #{orderNumber}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-left bg-secondary-background border-2 border-border rounded-base p-4 mb-6">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-main" />
                    <span>
                      Confirmación enviada a <strong>{formData.email}</strong>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-main" />
                    <span>Tus tickets han sido enviados por correo electrónico</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-main" />
                    <span>Asientos: <strong>{selectedSeats.join(', ')}</strong></span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/" className="flex-1">
                    <Button variant="neutral" className="w-full">
                      Volver a Inicio
                    </Button>
                  </Link>
                  <Link href="/recommendations" className="flex-1">
                    <Button className="w-full">
                      Ver Recomendaciones
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-border">
                    <div className="relative w-16 h-16 rounded-base overflow-hidden shrink-0 bg-muted border-2 border-border">
                      <Image
                        src={"/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs">Cantidad: {item.quantity}</span>
                        <span className="text-sm font-bold text-main">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} tickets)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comisión de servicio (10%)</span>
                  <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-main">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
