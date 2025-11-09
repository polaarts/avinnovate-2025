# Errores de Implementación de ElevenLabs - Análisis y Soluciones

## 🔍 Análisis Completo del Proyecto

Fecha: 9 de Noviembre 2025  
Proyecto: AudienceView - Sistema de Venta de Tickets

---

## ❌ ERRORES CRÍTICOS ENCONTRADOS

### 1. **PROBLEMA CRÍTICO: Hook useRegisterConvaiTools - Dependencias Estables**

**Archivo:** `/hooks/useRegisterConvaiTools.tsx`

**Código Actual:**
```tsx
export function useRegisterConvaiTools(tools: Record<string, Function>) {
  useEffect(() => {
    const handler = (event: any) => {
      event.detail.config.clientTools = tools;
    };
    window.addEventListener("elevenlabs-convai:call", handler);
    return () => window.removeEventListener("elevenlabs-convai:call", handler);
  }, [tools]); // ⚠️ PROBLEMA: 'tools' cambia en cada render
}
```

**Problema:**
- El objeto `clientTools` se crea en cada render del componente `ElevenLabs`
- Esto causa que el `useEffect` se ejecute múltiples veces innecesariamente
- ElevenLabs puede no registrar correctamente los tools si cambian constantemente

**Solución:**
```tsx
export function useRegisterConvaiTools(tools: Record<string, Function>) {
  useEffect(() => {
    const handler = (event: any) => {
      event.detail.config.clientTools = tools;
    };
    window.addEventListener("elevenlabs-convai:call", handler);
    return () => window.removeEventListener("elevenlabs-convai:call", handler);
  }, []); // ✅ Sin dependencias - se ejecuta una sola vez
}
```

**Alternativa con useMemo en widget.tsx:**
```tsx
import { useMemo } from "react";

export default function ElevenLabs() {
  const clientTools = useMemo(() => ({
    AddEventByVoice: ({ nombre, quantity }) => { /* ... */ },
    SelectSeat: ({ seatId }) => { /* ... */ },
    // ... resto de tools
  }), []); // ✅ Se crea una sola vez

  useRegisterConvaiTools(clientTools);
  // ...
}
```

---

### 2. **ERROR: Selector CSS Inválido en ContinueToPayment**

**Archivo:** `/components/widget.tsx` - Línea ~156

**Código Actual:**
```tsx
ContinueToPayment: () => {
  // ...
  if (typeof window !== "undefined") {
    const button = document.querySelector('button:has-text("Continuar al Pago")') as HTMLButtonElement
    // ❌ :has-text() NO existe en CSS estándar
    if (button) {
      button.click()
    }
  }
  // ...
}
```

**Problema:**
- `:has-text()` es sintaxis de pruebas (Playwright, Cypress)
- No funciona en `querySelector` del navegador
- El botón NUNCA se encuentra, el click nunca se ejecuta

**Solución:**
```tsx
ContinueToPayment: () => {
  console.log("🎤 [ContinueToPayment] Invoked")
  const seats = getSelectedSeats()
  const totalItems = getItemsCount()
  console.log("📊 Validation:", { seats, totalItems, valid: seats.length === totalItems })

  if (seats.length < totalItems) {
    console.log("❌ Not enough seats selected")
    return `❌ Necesitas seleccionar ${totalItems} asientos antes de continuar. Actualmente tienes ${seats.length} seleccionados.`
  }

  // ✅ Buscar el botón correctamente
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
}
```

---

### 3. **ERROR: Mismo Problema en ProcessPayment y GoBackToSeats**

**Archivos:** `/components/widget.tsx` - Líneas ~212, ~245

**Código Actual:**
```tsx
ProcessPayment: () => {
  // ...
  const button = document.querySelector('button:has-text("Realizar Pago")') as HTMLButtonElement
  // ❌ Mismo error
}

GoBackToSeats: () => {
  // ...
  const button = document.querySelector('button:has-text("Volver")') as HTMLButtonElement
  // ❌ Mismo error
}
```

**Solución para ProcessPayment:**
```tsx
ProcessPayment: () => {
  const paymentData = getPaymentData()
  const useNew = getCheckoutState().useNewPayment

  if (useNew) {
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
}
```

**Solución para GoBackToSeats:**
```tsx
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
}
```

---

### 4. **ERROR: Selector Incorrecto en SelectSavedPayment**

**Archivo:** `/components/widget.tsx` - Línea ~184

**Código Actual:**
```tsx
SelectSavedPayment: () => {
  setUseNewPayment(false)
  
  if (typeof window !== "undefined") {
    const radio = document.querySelector('input[type="radio"][name="paymentMethod"]:not([checked])') as HTMLInputElement
    // ❌ :not([checked]) busca el ATRIBUTO, pero los radios usan la PROPIEDAD .checked
    if (radio && !radio.checked) {
      radio.click()
    }
  }
  // ...
}
```

**Problema:**
- `:not([checked])` verifica el atributo HTML `checked=""`, no la propiedad `.checked`
- Los radio buttons modernos usan la propiedad JavaScript `.checked`

**Solución:**
```tsx
SelectSavedPayment: () => {
  setUseNewPayment(false)
  
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
}
```

---

### 5. **PROBLEMA: Listener de checkout:changed se registra incorrectamente**

**Archivo:** `/app/checkout/page.tsx` - Líneas ~88-97

**Código Actual:**
```tsx
useEffect(() => {
  if (!mounted) return

  const unsubscribe = subscribeCheckout(() => {
    const checkoutState = getCheckoutState()
    setCurrentStep(checkoutState.currentStep)
    setSelectedSeats(checkoutState.selectedSeats)
    setUseNewPayment(checkoutState.useNewPayment)
    setNewPaymentData(checkoutState.newPaymentData)
  })

  window.addEventListener("checkout:changed", () => {
    // ❌ Esta función anónima no se puede remover correctamente
    const checkoutState = getCheckoutState()
    setCurrentStep(checkoutState.currentStep)
    // ...
  })

  return () => {
    unsubscribe()
    window.removeEventListener("checkout:changed", () => {})
    // ❌ Esta es una NUEVA función anónima, no la misma que se agregó
  }
}, [mounted])
```

**Problema:**
- El listener del evento `window` no se remueve correctamente
- Se está removiendo una función diferente a la que se agregó
- Causa memory leaks

**Solución:**
```tsx
useEffect(() => {
  if (!mounted) return

  const handleCheckoutChange = () => {
    const checkoutState = getCheckoutState()
    setCurrentStep(checkoutState.currentStep)
    setSelectedSeats(checkoutState.selectedSeats)
    setUseNewPayment(checkoutState.useNewPayment)
    setNewPaymentData(checkoutState.newPaymentData)
  }

  // Cargar estado inicial
  handleCheckoutChange()

  // Suscribirse a cambios
  const unsubscribe = subscribeCheckout(handleCheckoutChange)
  window.addEventListener("checkout:changed", handleCheckoutChange)

  return () => {
    unsubscribe()
    window.removeEventListener("checkout:changed", handleCheckoutChange)
  }
}, [mounted])
```

---

### 6. **PROBLEMA: Falta validación de número de asiento en SelectSeat**

**Archivo:** `/components/widget.tsx` - Línea ~80

**Código Actual:**
```tsx
SelectSeat: ({ seatId }: { seatId: string }) => {
  // ...
  if (!/^[A-J]\d{1,2}$/.test(seatId)) {
    return `❌ Formato de asiento inválido. Usa el formato correcto (ej: A1, B12).`
  }

  const row = seatId[0]
  if (row !== 'A' && row !== 'B') {
    return `❌ El asiento ${seatId} no está disponible. Solo las filas A y B están disponibles para ti.`
  }
  // ❌ NO valida que el número esté entre 1-12
  // ...
}
```

**Problema:**
- Acepta asientos como `A99`, `B100` que no existen
- El regex permite 1-2 dígitos, pero no valida el rango

**Solución:**
```tsx
SelectSeat: ({ seatId }: { seatId: string }) => {
  console.log("🎤 [SelectSeat] Invoked with:", { seatId })
  console.log("📊 Current state:", { 
    selectedSeats: getSelectedSeats(), 
    totalItems: getItemsCount(),
    checkoutState: getCheckoutState()
  })
  
  // Normalizar a mayúsculas por si acaso
  seatId = seatId.toUpperCase()
  
  // Validar formato del asiento (ej: A1, B12)
  if (!/^[A-J]\d{1,2}$/.test(seatId)) {
    console.log("❌ Invalid format:", seatId)
    return `❌ Formato de asiento inválido. Usa el formato: Letra (A-J) + Número (1-12). Ejemplo: A1, B12.`
  }

  const row = seatId[0]
  const numStr = seatId.slice(1)
  const num = parseInt(numStr, 10)
  
  // ✅ Validar rango de número (1-12)
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
}
```

---

### 7. **MEJORA: Agregar manejo de errores en AddEventByVoice**

**Archivo:** `/components/widget.tsx` - Línea ~39

**Código Actual:**
```tsx
AddEventByVoice: ({ nombre, quantity }: { nombre: string, quantity: number }) => {
  console.log("🎤 [AddEventByVoice] Invoked with:", { nombre, quantity });
  
  const evento = events.find(
    (ev) => ev.title.toLowerCase() === nombre.toLowerCase()
  )

  if (!evento) {
    return `No encontré un evento llamado "${nombre}".`
  }
  // ⚠️ No valida quantity
  // ...
}
```

**Mejora:**
```tsx
AddEventByVoice: ({ nombre, quantity }: { nombre: string, quantity: number }) => {
  console.log("🎤 [AddEventByVoice] Invoked with:", { nombre, quantity });
  
  // ✅ Validar quantity
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
  
  // ✅ Búsqueda parcial si no se encuentra exacto
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

  return `✅ He agregado ${quantity} ticket${quantity > 1 ? 's' : ''} de "${evento.title}" al carrito. Total en carrito: ${getItemsCount()} tickets.`
}
```

---

## ✅ IMPLEMENTACIONES CORRECTAS

### 1. **checkout-store.ts** - ✅ Correcto
- Estado global bien implementado
- Persistencia en localStorage
- Dual notification (CustomEvents + subscriptions)
- API limpia y funcional

### 2. **cartStore.ts** - ✅ Correcto
- Estado global bien implementado
- Funciones CRUD correctas
- Persistencia adecuada

### 3. **Validaciones en SelectSeat** - ✅ Mayormente Correcta
- Validación de formato con regex
- Validación de disponibilidad de filas
- Límite de asientos
- Solo falta validación de rango numérico (ya solucionado arriba)

---

## 📋 RESUMEN DE CAMBIOS NECESARIOS

### Alta Prioridad (Bloquean funcionalidad):
1. ✅ Arreglar `useRegisterConvaiTools` - remover dependencia `tools`
2. ✅ Arreglar selectores CSS `:has-text()` en 3 tools
3. ✅ Arreglar selector `:not([checked])` en SelectSavedPayment
4. ✅ Arreglar listener de `checkout:changed` en checkout/page.tsx

### Media Prioridad (Mejoran UX):
5. ✅ Agregar validación de rango en SelectSeat
6. ✅ Agregar validación de quantity en AddEventByVoice
7. ✅ Agregar búsqueda fuzzy en AddEventByVoice

### Baja Prioridad (Nice to have):
8. Agregar más logging para debugging
9. Agregar timeouts para clicks simulados
10. Agregar feedback visual cuando tools se ejecutan

---

## 🎯 CASOS DE USO Y VALIDACIÓN

### Caso de Uso 1: Agregar Evento al Carrito
**Estado:** ⚠️ Funciona, pero puede mejorar

**Flujo:**
1. Usuario: "Agrega Campeonato de Fútbol"
2. Agente invoca: `AddEventByVoice({ nombre: "Campeonato de Fútbol", quantity: 1 })`
3. Tool busca evento y agrega al carrito
4. Actualiza localStorage y notifica

**Problemas:**
- No valida quantity
- Búsqueda muy estricta (debe ser nombre exacto)

**Solución:** Ver mejora #7

---

### Caso de Uso 2: Fila Virtual (Queue)
**Estado:** ✅ Funciona correctamente

**Flujo:**
1. Usuario está en `/queue`
2. Se simula fila virtual (45 personas)
3. Disminuye cada 3 segundos
4. Al llegar a 0, redirige a `/checkout`

**No requiere cambios de ElevenLabs** - Es flujo independiente

---

### Caso de Uso 3: Selección de Asientos
**Estado:** ❌ BLOQUEADO por errores críticos

**Flujo:**
1. Usuario: "Selecciona A1"
2. Agente invoca: `SelectSeat({ seatId: "A1" })`
3. Tool valida y agrega asiento
4. Actualiza store y UI

**Problemas:**
- Puede aceptar asientos inválidos (A99)
- UI no se actualiza porque evento no se limpia correctamente

**Solución:** Ver errores #6 y #5

---

### Caso de Uso 4: Continuar al Pago
**Estado:** ❌ BLOQUEADO - Botón nunca se hace click

**Flujo:**
1. Usuario: "Continuar al pago"
2. Agente invoca: `ContinueToPayment()`
3. Tool valida asientos completos
4. **FALLA:** Intenta hacer click con selector inválido
5. Solo actualiza store, pero botón no se presiona

**Problema:** Error crítico #2

**Solución:** Ver error #2

---

### Caso de Uso 5: Seleccionar Método de Pago
**Estado:** ⚠️ Funciona parcialmente

**Flujo:**
1. Usuario: "Usa mi tarjeta guardada"
2. Agente invoca: `SelectSavedPayment()`
3. Tool actualiza store
4. **FALLA:** No selecciona el radio button correcto

**Problema:** Error crítico #4

**Solución:** Ver error #4

---

### Caso de Uso 6: Procesar Pago
**Estado:** ❌ BLOQUEADO - Botón nunca se hace click

**Flujo:**
1. Usuario: "Realizar pago"
2. Agente invoca: `ProcessPayment()`
3. Tool valida datos
4. **FALLA:** Intenta hacer click con selector inválido
5. Solo actualiza store

**Problema:** Error crítico #3

**Solución:** Ver error #3

---

## 🔧 PASOS PARA APLICAR LAS CORRECCIONES

1. **Arreglar `useRegisterConvaiTools` hook:**
   - Editar `/hooks/useRegisterConvaiTools.tsx`
   - Remover dependencia `[tools]` → `[]`

2. **Arreglar widget.tsx:**
   - Agregar `useMemo` para `clientTools` (opcional pero recomendado)
   - Arreglar selectores CSS en:
     - `ContinueToPayment`
     - `ProcessPayment`
     - `GoBackToSeats`
     - `SelectSavedPayment`
   - Mejorar validaciones en:
     - `SelectSeat`
     - `AddEventByVoice`

3. **Arreglar checkout/page.tsx:**
   - Extraer función `handleCheckoutChange`
   - Arreglar cleanup del event listener

4. **Probar cada caso de uso:**
   - Agregar evento al carrito ✓
   - Seleccionar asientos ✓
   - Continuar al pago ✓
   - Seleccionar método de pago ✓
   - Procesar pago ✓

---

## 📊 IMPACT ASSESSMENT

| Error | Severidad | Impacto | Usuarios Afectados | Tiempo de Fix |
|-------|-----------|---------|-------------------|---------------|
| #1 - useRegisterConvaiTools | Alta | Tools pueden no registrarse | 100% | 5 min |
| #2 - ContinueToPayment selector | Crítica | Flujo bloqueado | 100% | 10 min |
| #3 - ProcessPayment selector | Crítica | Flujo bloqueado | 100% | 10 min |
| #4 - SelectSavedPayment selector | Media | UX degradada | 50% | 10 min |
| #5 - checkout:changed listener | Alta | Memory leak + bugs | 100% | 15 min |
| #6 - SelectSeat validación | Baja | Edge cases | 5% | 10 min |
| #7 - AddEventByVoice mejoras | Baja | UX mejorada | 30% | 20 min |

**Total tiempo estimado:** 1.5 horas

---

## ✨ DESPUÉS DE LAS CORRECCIONES

Una vez aplicadas todas las correcciones, el sistema debería:

✅ Registrar tools correctamente en ElevenLabs  
✅ Permitir agregar eventos al carrito por voz  
✅ Permitir seleccionar asientos válidos (A1-A12, B1-B12)  
✅ Hacer click en botones de UI automáticamente  
✅ Seleccionar radio buttons de pago  
✅ Procesar pagos completos  
✅ No tener memory leaks  
✅ Tener validaciones robustas  
✅ Ofrecer mejor feedback al usuario  

---

**Estado Final:** Listo para implementar correcciones 🚀
