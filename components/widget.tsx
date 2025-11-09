"use client";

import React from "react";
//import { addItemByName } from "@/lib/cartStore";
import { useRegisterConvaiTools } from "@/hooks/useRegisterConvaiTools";
import { addItem } from "@/lib/cartStore" // ✅ importa la función
import events from "@/data/events.json" assert { type: "json" } // para buscar el evento



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
        quantity: quantity,
        image: evento.image,
        date: evento.date,
        time: evento.time,
        location: evento.location,
        category: evento.category,
        isReserved: true,           // para marcar que vino del agente
      })

      return `He agregado "${evento.title}" al carrito.`
    },
  };
  

  // Registramos el handler usando el hook reutilizable
  useRegisterConvaiTools(clientTools);

  return (
    <>
      {/* El widget en sí */}
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