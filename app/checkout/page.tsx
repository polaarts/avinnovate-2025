"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/checkout/1")
  }, [router])

  return null
}
