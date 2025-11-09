"use client";

import React from "react";
import { useRegisterConvaiTools } from "@/hooks/useRegisterConvaiTools";
import { addItem, getItemsCount } from "@/lib/cartStore"
import { 
  getCheckoutState, 
  setCurrentStep, 
  addSeat, 
  removeSeat, 
  clearSeats,
  getSelectedSeats,
  setUseNewPayment,
  updatePaymentData,
  getPaymentData
} from "@/lib/checkout-store"
import events from "@/data/events.json" assert { type: "json" }



// 1. Declaramos el custom element para TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { "agent-id"?: string };
    }
  }
}

export default function ElevenLabs() {
  // ==================== CLIENT TOOLS ====================
  const clientTools = {
    // ===== CART TOOLS =====
    AddEventByVoice: ({ nombre, quantity }: { nombre: string, quantity: number }) => {
      console.log("🎤 [AddEventByVoice] Invoked with:", { nombre, quantity });
      
      const evento = events.find(
        (ev) => ev.title.toLowerCase() === nombre.toLowerCase()
      )

      if (!evento) {
        return `No encontré un evento llamado "${nombre}".`
      }
      
      console.log("🛒 Agregando al carrito por voz:", evento)

      addItem({
        id: evento.id,
        name: evento.title,
        price: evento.price,
        quantity: quantity,
        image: evento.image,
        date: evento.date,
        time: evento.time,
        location: evento.location,
        category: evento.category,
        isReserved: true,
      })

      return `✅ He agregado ${quantity} ticket${quantity > 1 ? 's' : ''} de "${evento.title}" al carrito.`
    },

    // ===== CHECKOUT - SEAT SELECTION TOOLS =====
    SelectSeat: ({ seatId }: { seatId: string }) => {
      console.log("🎤 [SelectSeat] Invoked with:", { seatId })
      console.log("📊 Current state:", { 
        selectedSeats: getSelectedSeats(), 
        totalItems: getItemsCount(),
        checkoutState: getCheckoutState()
      })
      
      // Validar formato del asiento (ej: A1, B12)
      if (!/^[A-J]\d{1,2}$/.test(seatId)) {
        console.log("❌ Invalid format:", seatId)
        return `❌ Formato de asiento inválido. Usa el formato correcto (ej: A1, B12).`
      }

      const row = seatId[0]
      // Solo filas A y B están disponibles (según mockUserData)
      if (row !== 'A' && row !== 'B') {
        return `❌ El asiento ${seatId} no está disponible. Solo las filas A y B están disponibles para ti.`
      }

      const totalItems = getItemsCount()
      const currentSeats = getSelectedSeats()

      if (currentSeats.includes(seatId)) {
        return `⚠️ El asiento ${seatId} ya está seleccionado. ¿Quieres deseleccionarlo?`
      }

      if (currentSeats.length >= totalItems) {
        return `❌ Ya seleccionaste ${totalItems} asientos (el máximo según tus tickets). Si quieres cambiar, primero deselecciona otro asiento.`
      }

      addSeat(seatId, totalItems)
      const updatedSeats = getSelectedSeats()
      
      return `✅ Asiento ${seatId} seleccionado. Tienes ${updatedSeats.length} de ${totalItems} asientos seleccionados: ${updatedSeats.join(', ')}.`
    },

    DeselectSeat: ({ seatId }: { seatId: string }) => {
      const currentSeats = getSelectedSeats()
      
      if (!currentSeats.includes(seatId)) {
        return `⚠️ El asiento ${seatId} no está en tu selección actual.`
      }

      removeSeat(seatId)
      const updatedSeats = getSelectedSeats()
      
      return `✅ Asiento ${seatId} deseleccionado. Ahora tienes ${updatedSeats.length} asientos seleccionados${updatedSeats.length > 0 ? ': ' + updatedSeats.join(', ') : ''}.`
    },

    GetSelectedSeats: () => {
      const seats = getSelectedSeats()
      const totalItems = getItemsCount()
      
      if (seats.length === 0) {
        return `No has seleccionado ningún asiento aún. Necesitas seleccionar ${totalItems} asiento${totalItems > 1 ? 's' : ''}.`
      }

      return `Tienes ${seats.length} de ${totalItems} asientos seleccionados: ${seats.join(', ')}.${seats.length < totalItems ? ` Faltan ${totalItems - seats.length} asiento${totalItems - seats.length > 1 ? 's' : ''}.` : ''}`
    },

    ClearSeats: () => {
      clearSeats()
      return `✅ He limpiado la selección de asientos. Puedes volver a seleccionar.`
    },

    ContinueToPayment: () => {
      console.log("🎤 [ContinueToPayment] Invoked")
      const seats = getSelectedSeats()
      const totalItems = getItemsCount()
      console.log("📊 Validation:", { seats, totalItems, valid: seats.length === totalItems })

      if (seats.length < totalItems) {
        console.log("❌ Not enough seats selected")
        return `❌ Necesitas seleccionar ${totalItems} asientos antes de continuar. Actualmente tienes ${seats.length} seleccionados.`
      }

      // Simular click en el botón "Continuar al Pago"
      if (typeof window !== "undefined") {
        const button = document.querySelector('button:has-text("Continuar al Pago")') as HTMLButtonElement
        if (button) {
          button.click()
          setCurrentStep(2)
          return `✅ Avanzando al paso de pago. Tus asientos seleccionados son: ${seats.join(', ')}.`
        }
      }

      setCurrentStep(2)
      return `✅ Continuando al paso de pago con los asientos: ${seats.join(', ')}.`
    },

    // ===== CHECKOUT - PAYMENT TOOLS =====
    SelectSavedPayment: () => {
      setUseNewPayment(false)
      
      // Simular click en el radio button del método guardado
      if (typeof window !== "undefined") {
        const radio = document.querySelector('input[type="radio"][name="paymentMethod"]:not([checked])') as HTMLInputElement
        if (radio && !radio.checked) {
          radio.click()
        }
      }

      return `✅ He seleccionado tu método de pago guardado (Visa ••••4242). ¿Deseas realizar el pago?`
    },

    SelectNewPayment: () => {
      setUseNewPayment(true)

      // Simular click en el radio button de nuevo método
      if (typeof window !== "undefined") {
        const radios = document.querySelectorAll('input[type="radio"][name="paymentMethod"]')
        const newPaymentRadio = radios[1] as HTMLInputElement
        if (newPaymentRadio && !newPaymentRadio.checked) {
          newPaymentRadio.click()
        }
      }

      return `✅ He seleccionado "Agregar nuevo método de pago". Por seguridad, NO puedo recibir los datos de tu tarjeta por voz. Por favor, ingresa manualmente:\n- Número de tarjeta\n- Nombre en la tarjeta\n- Fecha de expiración (MM/AA)\n- CVV\n\nCuando termines de llenar los datos, dime "realizar pago".`
    },

    ProcessPayment: () => {
      const paymentData = getPaymentData()
      const useNew = getCheckoutState().useNewPayment

      if (useNew) {
        // Validar que todos los campos estén llenos
        if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
          return `❌ Faltan datos del método de pago. Por favor, completa todos los campos en el formulario:\n- Número de tarjeta\n- Nombre en la tarjeta\n- Fecha de expiración\n- CVV`
        }
      }

      // Simular click en el botón "Realizar Pago"
      if (typeof window !== "undefined") {
        const button = document.querySelector('button:has-text("Realizar Pago")') as HTMLButtonElement
        if (button && !button.disabled) {
          button.click()
          return `✅ Procesando tu pago... Por favor espera un momento.`
        }
      }

      setCurrentStep(3)
      return `✅ Pago procesado exitosamente. Tu compra ha sido confirmada.`
    },

    GoBackToSeats: () => {
      setCurrentStep(1)

      // Simular click en el botón "Volver"
      if (typeof window !== "undefined") {
        const button = document.querySelector('button:has-text("Volver")') as HTMLButtonElement
        if (button) {
          button.click()
        }
      }

      return `✅ Volviendo a la selección de asientos. Puedes modificar tus asientos seleccionados.`
    },

    // ===== CHECKOUT - CONFIRMATION TOOLS =====
    GoToHome: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
      return `✅ Llevándote a la página de inicio...`
    },

    GoToRecommendations: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/recommendations"
      }
      return `✅ Llevándote a ver recomendaciones de eventos que podrían interesarte...`
    },
  };
  

  // Registramos el handler usando el hook reutilizable
  useRegisterConvaiTools(clientTools);

  return (
    <>
      {/* El widget en sí */}
      <elevenlabs-convai agent-id="agent_9301k9hrshh2fx2rnhbzwz8xd7k6"></elevenlabs-convai>

      {/* Carga del script del widget */}
      <script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        async
        type="text/javascript"
      ></script>
    </>
  );
}