"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import Image from "next/image"

export default function QueuePage() {
  const TOTAL_PEOPLE = 60 // Total de personas en la fila inicial (1 minuto = 60 segundos)
  
  const [peopleInQueue, setPeopleInQueue] = useState(TOTAL_PEOPLE)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      // Siempre comenzar con TOTAL_PEOPLE y limpiar localStorage
      localStorage.setItem("queuePeopleRemaining", TOTAL_PEOPLE.toString())
      setPeopleInQueue(TOTAL_PEOPLE)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Simulación de la fila: disminuye cada 1 segundo (60 personas en 60 segundos)
  useEffect(() => {
    if (!mounted) return

    const timer = setInterval(() => {
      setPeopleInQueue((prev) => {
        const newCount = prev > 0 ? prev - 1 : 0
        localStorage.setItem("queuePeopleRemaining", newCount.toString())
        return newCount
      })
    }, 1000) // Cada 1 segundo se va una persona

    return () => clearInterval(timer)
  }, [mounted])

  // Redirigir a checkout cuando la fila llegue a 0
  useEffect(() => {
    if (mounted && peopleInQueue === 0) {
      // Pequeño delay para que el usuario vea que llegó a 0
      const redirectTimer = setTimeout(() => {
        router.push("/checkout/1")
      }, 2000) // 2 segundos de delay

      return () => clearTimeout(redirectTimer)
    }
  }, [peopleInQueue, mounted, router])

  const progressPercentage = peopleInQueue > 0 ? ((TOTAL_PEOPLE - peopleInQueue) / TOTAL_PEOPLE) * 100 : 100
  const estimatedWaitTime = peopleInQueue // segundos restantes

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Franja de fila virtual */}
      <div className="bg-main border-b-2 border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-main-foreground">
              <Users className="w-5 h-5" />
              <span className="font-bold text-lg">People in line before you</span>
            </div>
            <span className="font-bold text-3xl text-main-foreground tabular-nums">
              {peopleInQueue}
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full h-3 bg-secondary-background border-2 border-border rounded-base overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-main-foreground text-sm font-medium">
              ⏱️ Estimated wait time: <span className="font-bold">{estimatedWaitTime}s</span>
            </p>

            {peopleInQueue < 10 && peopleInQueue > 0 && (
              <p className="text-main-foreground text-sm font-semibold">
                ⚡ Almost your turn!
              </p>
            )}

            {peopleInQueue === 0 && (
              <p className="text-main-foreground text-sm font-semibold">
                ✅ It's your turn! Redirecting to payment...
              </p>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 md:py-12 w-full">

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Avatar apuntando al widget */}
          <div className="flex justify-center">
            <Image src={"/ticketin.png"} alt="Ticketin" width={500} height={300} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What happens while you wait?</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-main font-bold">1.</span>
                <span>We are reserving your spot in the system</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-main font-bold">2.</span>
                <span>We verify seat availability in real time</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-main font-bold">3.</span>
                <span>We prepare your personalized shopping experience</span>
              </p>
            </div>
            <div className="p-4 bg-main/10 border-2 border-border rounded-base">
              <p className="text-sm font-semibold text-foreground">
                💡 <strong>Tip:</strong> Keep this tab open. You will be automatically redirected when it's your turn.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
