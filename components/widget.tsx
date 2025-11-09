"use client";
/// <reference path="../types/elevenlabs-convai.d.ts" />

import React from "react";
import { useRouter } from "next/navigation";
//import { addItemByName } from "@/lib/cartStore";
import { useRegisterConvaiTools } from "@/hooks/useRegisterConvaiTools";
import { addItem, clearCart } from "@/lib/cartStore" // ✅ importa la función
import events from "@/data/events.json" assert { type: "json" } // para buscar el evento
import { saveSelectedSeat, getSelectedSeat, removeSelectedSeat } from "@/lib/cartStore";
import { Delete } from "lucide-react";


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
  const router = useRouter();
  // Definimos los client tools en el scope del componente
  const clientTools = {
    testTool: ({ text }: { text: string }) => {
      console.log(events);
      console.log("✅ Tool executed by the agent with parameter:", text);
      return "Funciona!";
    },
    GetNombreProduct: ({ nombre }: { nombre: string }) => {
      //const item = addItemByName(nombre);
      //console.log("🛒 Agregado por widget:", item);
      //return `He agregado "${item.name}" al carrito.`;
    },
    // Changes the route from the agent (client)
    NavigateTo: ({ path, replace }: { path: string; replace?: boolean }) => {
      if (!path || typeof path !== "string") return "Invalid route";
      try {
        removeSelectedSeat();
        replace ? router.replace(path) : router.push(path);
        return `Navigating to ${path}`;
      } catch (err) {
        console.error("❌ Navigation error:", err);
        return `Error navigating to ${path}`;
      }
    },
    AddEventByVoice: ({ nombre, quantity }: { nombre: string, quantity: number }) => {
        console.log("🛒 Adding name and quantity:", nombre, quantity);
        console.log(events);
        // If the name doesn't exist in events, ask again

      // Normalize the name to search without errors

      const evento = (events as any[]).find(
        (ev) => ev.title.toLowerCase() === nombre.toLowerCase()
      )
      console.log("🛒 Adding to cart by voice:", evento)

      // Llamada directa a tu función global addItem()
      addItem({
        id: evento.id,
        name: evento.title,         // tu carrito usa "name"
        price: evento.price,
        // Quantity variable si no, 1 por defecto
        quantity: quantity || 1,
        image: evento.image,
        date: evento.date,
        time: evento.time,
        location: evento.location,
        category: evento.category,
        isReserved: true,           // para marcar que vino del agente
      })
      return `He agregado "${evento.title}" al carrito.`
    },
    ExecuteRoute: ({ Id }: { Id: string }) => {
      console.log("Ejecutando ruta con Id:", Id);
      const safeId = (window as any).CSS?.escape ? (window as any).CSS.escape(Id) : Id.replace(/[^a-zA-Z0-9\-_:.]/g, "\\$&")
      console.log("Ejecutando ruta con Id seguro:", safeId);
      const el = document.getElementById(Id) || document.querySelector(`#${safeId}`)
      console.log("Elemento encontrado:", el);
      if (el) {
        el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        return `Ruta con Id ${Id} ejecutada.`;
      } else {
        return `No se encontró ningún elemento con Id ${Id}.`;
      }

      
    },
    QueueAsks: ({ seatId }: { seatId: string }) => {
      saveSelectedSeat({ id: seatId ,name: seatId, quantity: 1 });
      console.log("Asiento seleccionado en queue",getSelectedSeat());
      return `Asiento ${seatId} seleccionado en queue.`;
      
    },
    SelectSeat:({ seatId }: { seatId: string }) => {
      console.log("Selecting seat with Id:", seatId);
      // Here you could call a function to select the seat in your store
      saveSelectedSeat({ id: seatId ,name: seatId, quantity: 1 });
      console.log("Selected seat",getSelectedSeat());
      return `Seat ${seatId} selected.`;
    },
    CleanCart:() => {
      clearCart();
      removeSelectedSeat();
      console.log("Carrito limpio");
    },
    FillCheckoutFields: (payload: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    }) => {
      const safe = {
        form: {
          firstName: payload.firstName?.trim() || undefined,
          lastName: payload.lastName?.trim() || undefined,
          email: payload.email?.trim() || undefined,
          phone: payload.phone?.trim() || undefined,
        }
      };

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("checkout:fill", { detail: safe }));
      }
      return "Data sent to checkout";
    }
  };
  




  // Registramos el handler usando el hook reutilizable
  useRegisterConvaiTools(clientTools);

  return (
    <>
  {/* El widget en sí */}
  {/* @ts-ignore: Custom element tipado vía declaración global */}
  <elevenlabs-convai agent-id="agent_5801k9kr29djemht39yyt91tqrfm"></elevenlabs-convai>

      {/* Carga del script del widget */}
      <script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        async
        type="text/javascript"
      ></script>
    </>
  );
}