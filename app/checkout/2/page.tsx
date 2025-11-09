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
import { ArrowLeft, CreditCard, Lock, CheckCircle, ShoppingBag } from "lucide-react"
import { getItems, type CartItem } from "@/lib/cartStore"

// Método de pago guardado (mockeado)
const savedPaymentMethod = {
  type: "visa",
  lastDigits: "4242",
  cardName: "JOHN SMITH",
  expiryDate: "12/26",
}

export default function CheckoutStep2() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [useNewPayment, setUseNewPayment] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      const currentItems = getItems()
      setItems(currentItems)

      // Verificar que hay items y datos del paso anterior
      if (currentItems.length === 0) {
        router.push("/cart")
        return
      }

      // Verificar que se completó el paso 1
      const personalData = localStorage.getItem("checkoutPersonalData")
      const selectedSeats = localStorage.getItem("checkoutSelectedSeats")
      
      if (!personalData || !selectedSeats) {
        router.push("/checkout/1")
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateStep = () => {
    if (!useNewPayment) return true
    
    return (
      formData.cardNumber.trim() !== "" &&
      formData.cardName.trim() !== "" &&
      formData.expiryDate.trim() !== "" &&
      formData.cvv.trim() !== ""
    )
  }

  const handlePayment = async () => {
    if (!validateStep()) return

    setIsProcessing(true)
    
    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Generar número de orden
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
    
    // Guardar datos de la orden
    const orderData = {
      orderNumber,
      timestamp: new Date().toISOString(),
      paymentMethod: useNewPayment ? "new" : "saved",
    }
    localStorage.setItem("checkoutOrderData", JSON.stringify(orderData))
    
    setIsProcessing(false)
    router.push("/checkout/3")
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

  const subtotal = items.reduce((acc: number, it: CartItem) => acc + it.price * it.quantity, 0)
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Link
          href="/checkout/1"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to information
        </Link>

        {/* Indicador de pasos */}
        <CheckoutSteps currentStep={2} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de pago */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-main" />
                Payment Method
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
                        <span className="font-bold">Add new payment method</span>
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
                        <label className="block text-sm font-semibold mb-2">Card Number *</label>
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
                        <label className="block text-sm font-semibold mb-2">Name on Card *</label>
                        <Input
                          type="text"
                          placeholder="FULL NAME"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Expiration *</label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
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
                      <p className="font-bold text-sm mb-1">100% Secure Payment</p>
                      <p className="text-xs text-foreground/70">
                        Your information is protected with 256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t-2 border-border">
                <Button
                  variant="neutral"
                  onClick={() => router.push("/checkout/1")}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!validateStep() || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Make Payment ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </Card>
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
