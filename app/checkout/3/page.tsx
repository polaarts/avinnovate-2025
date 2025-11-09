"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CheckoutSteps from "@/components/checkout-steps"
import { CheckCircle, Mail } from "lucide-react"

export default function CheckoutStep3() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)

      // Verificar que se completaron los pasos anteriores
      const personalData = localStorage.getItem("checkoutPersonalData")
      const selectedSeatsData = localStorage.getItem("checkoutSelectedSeats")
      const orderData = localStorage.getItem("checkoutOrderData")

      if (!personalData || !selectedSeatsData || !orderData) {
        router.push("/checkout/1")
        return
      }

      try {
        const personal = JSON.parse(personalData)
        const seats = JSON.parse(selectedSeatsData)
        const order = JSON.parse(orderData)

        setEmail(personal.email)
        setSelectedSeats(seats)
        setOrderNumber(order.orderNumber)
      } catch (error) {
        console.error("Error loading checkout data:", error)
        router.push("/checkout/1")
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [router])

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
        {/* Indicador de pasos */}
        <CheckoutSteps currentStep={3} />

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-main rounded-full flex items-center justify-center mx-auto mb-6 shadow-shadow">
              <CheckCircle className="w-12 h-12 text-main-foreground" />
            </div>

            <h2 className="text-3xl font-bold mb-3">Purchase Successful!</h2>
            <p className="text-lg text-foreground/70 mb-6">
              Your order has been confirmed
            </p>

            <div className="bg-main/10 border-2 border-border rounded-base p-6 mb-6">
              <p className="text-sm font-semibold mb-2">Order Number</p>
              <p className="text-2xl font-bold text-main">
                #{orderNumber}
              </p>
            </div>

            <div className="space-y-3 text-sm text-left bg-secondary-background border-2 border-border rounded-base p-4 mb-6">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-main" />
                <span>
                  Confirmation sent to <strong>{email}</strong>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-main" />
                <span>Your tickets have been sent via email</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-main" />
                <span>Seats: <strong>{selectedSeats.join(', ')}</strong></span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="neutral" className="w-full">
                  Back to Home
                </Button>
              </Link>
              <Link href="/recommendations" className="flex-1">
                <Button className="w-full">
                  View Recommendations
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
