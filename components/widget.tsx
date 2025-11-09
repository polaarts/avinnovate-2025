"use client";
/// <reference path="../types/elevenlabs-convai.d.ts" />

import React from "react";
import { useRouter } from "next/navigation";
//import { addItemByName } from "@/lib/cartStore";
import { useRegisterConvaiTools } from "@/hooks/useRegisterConvaiTools";
import { addItem } from "@/lib/cartStore" // ✅ importa la función
import events from "@/data/events.json" assert { type: "json" } // para buscar el evento
import { saveSelectedSeat, getSelectedSeat } from "@/lib/cartStore";


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
      console.log("✅ Tool ejecutado por el agente con parámetro:", text);
      return "Funciona!";
    },
    GetNombreProduct: ({ nombre }: { nombre: string }) => {
      //const item = addItemByName(nombre);
      //console.log("🛒 Agregado por widget:", item);
      //return `He agregado "${item.name}" al carrito.`;
    },
    // Cambia la ruta desde el agente (cliente)
    NavigateTo: ({ path, replace }: { path: string; replace?: boolean }) => {
      if (!path || typeof path !== "string") return "Ruta inválida";
      try {
        replace ? router.replace(path) : router.push(path);
        return `Navegando a ${path}`;
      } catch (err) {
        console.error("❌ Error navegando:", err);
        return `Error al navegar a ${path}`;
      }
    },
    AddEventByVoice: ({ nombre, quantity }: { nombre: string, quantity: number }) => {
        console.log("🛒 Agregando nombre y cantidad:", nombre, quantity);
        console.log(events);
        // Si el nombre no existe en events, se pregunta denuevo

      // Normalizamos el nombre para buscarlo sin errores

      const evento = (events as any[]).find(
        (ev) => ev.title.toLowerCase() === nombre.toLowerCase()
      )
      console.log("🛒 Agregando al carrito por voz:", evento)

      // ✅ Llamada directa a tu función global addItem()
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
      
    },
    QueueAsks: ({ seatId }: { seatId: string }) => {
      saveSelectedSeat({ id: seatId ,name: seatId, quantity: 1 });
      console.log("Asiento seleccionado en queue",getSelectedSeat());
      return `Asiento ${seatId} seleccionado en queue.`;
      
    },
    SelectSeat:({ seatId }: { seatId: string }) => {
      console.log("Seleccionando asiento con Id:", seatId);
      // Aquí podrías llamar a una función para seleccionar el asiento en tu store
      saveSelectedSeat({ id: seatId ,name: seatId, quantity: 1 });
      console.log("Asiento seleccionado",getSelectedSeat());
      return `Asiento ${seatId} seleccionado.`;
    },
    // Rellena el formulario de checkout mediante un CustomEvent capturado en la página
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
      return "Datos enviados al checkout";
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