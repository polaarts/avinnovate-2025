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
      
      // Validar quantity
      if (!quantity || quantity < 1) {
        quantity = 1
        console.log("⚠️ Invalid quantity, defaulting to 1")
      }
      
      if (quantity > 10) {
        return `❌ No puedes agregar más de 10 tickets por evento. Si necesitas más, contáctanos.`
      }
      
      // Buscar evento (case-insensitive y fuzzy matching)
      const normalizedNombre = nombre.toLowerCase().trim()
      let evento = events.find(
        (ev) => ev.title.toLowerCase() === normalizedNombre
      )
      
      // Búsqueda parcial si no se encuentra exacto
      if (!evento) {
        evento = events.find(
          (ev) => ev.title.toLowerCase().includes(normalizedNombre) ||
                  normalizedNombre.includes(ev.title.toLowerCase())
        )
      }

      if (!evento) {
        const eventosDisponibles = events.map(e => e.title).join(', ')
        return `No encontré un evento llamado "${nombre}". Eventos disponibles: ${eventosDisponibles}.`
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

      const totalInCart = getItemsCount()
      return `✅ He agregado ${quantity} ticket${quantity > 1 ? 's' : ''} de "${evento.title}" al carrito. Total en carrito: ${totalInCart} tickets.`
    },

    // ===== CHECKOUT - SEAT SELECTION TOOLS =====
    SelectSeat: ({ seatId }: { seatId: string }) => {
      console.log("🎤 [SelectSeat] Invoked with:", { seatId })
      console.log("📊 Current state:", { 
        selectedSeats: getSelectedSeats(), 
        totalItems: getItemsCount(),
        checkoutState: getCheckoutState()
      })
      
      // Normalizar a mayúsculas
      seatId = seatId.toUpperCase().trim()
      
      // Validar formato del asiento (ej: A1, B12)
      if (!/^[A-J]\d{1,2}$/.test(seatId)) {
        console.log("❌ Invalid format:", seatId)
        return `❌ Formato de asiento inválido. Usa el formato: Letra (A-J) + Número (1-12). Ejemplo: A1, B12.`
      }

      const row = seatId[0]
      const numStr = seatId.slice(1)
      const num = parseInt(numStr, 10)
      
      // Validar rango de número (1-12)
      if (num < 1 || num > 12) {
        return `❌ El asiento ${seatId} no existe. Los números de asiento van del 1 al 12.`
      }
      
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

      // ✅ Buscar el botón correctamente (sin :has-text que no existe en CSS)
      if (typeof window !== "undefined") {
        const buttons = Array.from(document.querySelectorAll('button'))
        const button = buttons.find(btn => 
          btn.textContent?.trim() === "Continuar al Pago" ||
          btn.textContent?.includes("Continuar")
        ) as HTMLButtonElement
        
        if (button && !button.disabled) {
          button.click()
          console.log("✅ Button clicked successfully")
        } else {
          console.log("⚠️ Button not found or disabled, updating state only")
        }
      }

      setCurrentStep(2)
      return `✅ Avanzando al paso de pago. Tus asientos seleccionados son: ${seats.join(', ')}.`
    },

    // ===== CHECKOUT - PAYMENT TOOLS =====
    SelectSavedPayment: () => {
      setUseNewPayment(false)
      
      // ✅ Seleccionar el radio button correctamente
      if (typeof window !== "undefined") {
        const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"][name="paymentMethod"]')
        // El primer radio es el método guardado
        const savedPaymentRadio = radios[0]
        
        if (savedPaymentRadio && !savedPaymentRadio.checked) {
          savedPaymentRadio.click()
          console.log("✅ Saved payment method selected")
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

      // ✅ Buscar el botón correctamente
      if (typeof window !== "undefined") {
        const buttons = Array.from(document.querySelectorAll('button'))
        const button = buttons.find(btn => 
          btn.textContent?.includes("Realizar Pago") ||
          btn.textContent?.includes("Pagar")
        ) as HTMLButtonElement
        
        if (button && !button.disabled) {
          button.click()
          console.log("✅ Payment button clicked")
          return `✅ Procesando tu pago... Por favor espera un momento.`
        }
      }

      setCurrentStep(3)
      return `✅ Pago procesado exitosamente. Tu compra ha sido confirmada.`
    },

    GoBackToSeats: () => {
      // ✅ Buscar el botón correctamente
      if (typeof window !== "undefined") {
        const buttons = Array.from(document.querySelectorAll('button'))
        const button = buttons.find(btn => 
          btn.textContent?.trim() === "Volver" ||
          btn.textContent?.includes("Atrás")
        ) as HTMLButtonElement
        
        if (button) {
          button.click()
          console.log("✅ Back button clicked")
        }
      }

      setCurrentStep(1)
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