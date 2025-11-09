"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { getItems, getItemsCount, type CartItem } from "@/lib/cartStore"
import { useEffect, useState } from "react"

export default function OrderSummary() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setItems(getItems())
    }, 0)

    function handleCartChanged() {
      setItems(getItems())
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cart:changed", handleCartChanged)
    }

    return () => {
      clearTimeout(timer)
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:changed", handleCartChanged)
      }
    }
  }, [])

  if (!mounted) {
    return (
      <Card className="p-6 sticky top-24">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    )
  }

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee
  const totalItems = getItemsCount()

  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

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
                <span className="text-xs">Quantity: {item.quantity}</span>
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
          <span className="text-muted-foreground">Service fee (10%)</span>
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
  )
}
