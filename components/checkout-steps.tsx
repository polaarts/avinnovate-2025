"use client"

import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface CheckoutStepsProps {
  currentStep: number
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { num: 1, label: "Info & Seats", href: "/checkout/1" },
    { num: 2, label: "Payment", href: "/checkout/2" },
    { num: 3, label: "Confirmation", href: "/checkout/3" },
  ]

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <Link
              href={step.num < currentStep ? step.href : "#"}
              className={step.num < currentStep ? "cursor-pointer" : "pointer-events-none"}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 border-border flex items-center justify-center font-bold transition-all ${
                  step.num === currentStep
                    ? "bg-main text-main-foreground shadow-shadow"
                    : step.num < currentStep
                    ? "bg-foreground text-background hover:scale-105"
                    : "bg-secondary-background text-foreground"
                }`}
              >
                {step.num < currentStep ? <CheckCircle className="w-5 h-5" /> : step.num}
              </div>
            </Link>
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
  )
}
