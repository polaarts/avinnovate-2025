"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { useToast } from "@/components/ui/toast"

export interface EventData {
  id: string
  title: string
  artist: string
  date: string
  time: string
  location: string
  image: string
  category: string
  price: number
}

interface AddToCartButtonProps {
  event: EventData
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  isReservedByAgent?: boolean // Nuevo parámetro para indicar si proviene del agente de voz
}

export default function AddToCartButton({ 
  event, 
  size = "sm", 
  className = "",
  showIcon = true,
  isReservedByAgent = false, // Por defecto es false (clicks manuales)
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { addToast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir propagación si está dentro de un card clickeable
    
    addItem({
      id: event.id,
      title: event.title,
      artist: event.artist,
      price: event.price,
      image: event.image,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      quantity: 1,
      isReserved: isReservedByAgent, // Usa el parámetro para determinar la fuente
    })

    addToast({
      title: "✓ Agregado al carrito",
      description: `${event.title} se ha agregado correctamente`,
      duration: 3000,
    })
  }

  return (
    <Button 
      size={size}
      onClick={handleAddToCart}
      className={`bg-primary hover:bg-primary/90 gap-1.5 ${className}`}
    >
      {showIcon && <ShoppingCart className="w-3.5 h-3.5" />}
      Agregar
    </Button>
  )
}
