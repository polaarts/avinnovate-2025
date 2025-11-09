# Guía para Crear Funcionalidades con ElevenLabs

## 📚 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Conceptos Fundamentales](#conceptos-fundamentales)
3. [Anatomía de un Client Tool](#anatomía-de-un-client-tool)
4. [Patrones de Integración](#patrones-de-integración)
5. [Casos de Uso por Módulo](#casos-de-uso-por-módulo)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Troubleshooting](#troubleshooting)
8. [Recursos de ElevenLabs](#recursos-de-elevenlabs)

---

## 📖 Introducción

Esta guía te ayudará a extender la integración de ElevenLabs a otros módulos de la plataforma AudienceView. Se basa en la implementación existente del carrito de compras y proporciona patrones reutilizables para crear nuevas funcionalidades conversacionales.

### ¿Qué puedes hacer con ElevenLabs?

- **Navegación por voz:** "Llévame a mis reservas"
- **Búsqueda inteligente:** "Muéstrame conciertos de rock este fin de semana"
- **Gestión de cuenta:** "Actualiza mi método de pago"
- **Soporte al cliente:** "¿Cuál es la política de reembolso?"
- **Acciones complejas:** "Cambia mi asiento de A5 a B3 para el evento del sábado"

---

## 🧠 Conceptos Fundamentales

### 1. Client Tools

Los **Client Tools** son funciones JavaScript que el agente de ElevenLabs puede invocar durante una conversación. Piensa en ellos como "superpoderes" que le das al agente para interactuar con tu aplicación.

**Estructura básica:**
```typescript
const clientTools = {
  nombreDeLaFuncion: (parametros) => {
    // Lógica de tu aplicación
    return "Respuesta para el usuario"
  }
}
```

### 2. Convai Widget

El widget conversacional de ElevenLabs se integra mediante:
```tsx
<elevenlabs-convai agent-id="tu-agent-id"></elevenlabs-convai>
```

### 3. Hook de Registro

```typescript
useRegisterConvaiTools(clientTools)
```
Este hook comunica tus funciones al agente durante la inicialización del widget.

### 4. Flujo de Comunicación

```
Usuario (Voz/Texto)
    ↓
ElevenLabs (Procesa lenguaje natural)
    ↓
Agente (Decide qué tool invocar)
    ↓
Client Tool (Tu función JavaScript)
    ↓
Aplicación (Ejecuta lógica)
    ↓
Respuesta (Texto al agente)
    ↓
ElevenLabs (Sintetiza voz)
    ↓
Usuario (Escucha respuesta)
```

---

## 🔧 Anatomía de un Client Tool

### Estructura Completa

```typescript
type ToolParams = {
  param1: string
  param2: number
  param3?: boolean  // Parámetro opcional
}

const miTool: ClientTool<ToolParams> = ({ param1, param2, param3 }) => {
  // 1. VALIDACIÓN
  if (!param1 || param2 <= 0) {
    return "❌ Parámetros inválidos. Por favor, proporciona valores correctos."
  }

  // 2. LÓGICA DE NEGOCIO
  try {
    const resultado = hacerAlgo(param1, param2)
    
    // 3. EFECTOS SECUNDARIOS (si aplica)
    actualizarEstado(resultado)
    guardarEnLocalStorage(resultado)
    dispatchEvent(new CustomEvent("mi-evento", { detail: resultado }))
    
    // 4. RESPUESTA AL USUARIO
    return `✅ He completado la acción: ${resultado.mensaje}`
    
  } catch (error) {
    // 5. MANEJO DE ERRORES
    console.error("Error en miTool:", error)
    return "❌ Ocurrió un error. Por favor, intenta nuevamente."
  }
}
```

### Tipos de Retorno

#### ✅ Éxito Simple
```typescript
return "He agregado 3 tickets al carrito."
```

#### ✅ Éxito con Detalles
```typescript
return `Tu reserva #${bookingId} está confirmada para el ${date}. Total: $${total}.`
```

#### ❌ Error Amigable
```typescript
return "No encontré ese evento. ¿Puedes repetir el nombre?"
```

#### 🔄 Solicitud de Información
```typescript
return "¿Cuántos tickets deseas comprar?"
```

---

## 🎨 Patrones de Integración

### Patrón 1: CRUD de Datos

**Caso:** Gestión de favoritos

```typescript
// store/favorites-store.ts
let _favorites: string[] = []

export function addFavorite(eventId: string) {
  if (!_favorites.includes(eventId)) {
    _favorites.push(eventId)
    localStorage.setItem("favorites", JSON.stringify(_favorites))
    window.dispatchEvent(new CustomEvent("favorites:changed"))
  }
}

export function getFavorites(): string[] {
  return _favorites
}

// components/widget.tsx
const clientTools = {
  AddToFavorites: ({ eventName }: { eventName: string }) => {
    const event = events.find(e => 
      e.title.toLowerCase() === eventName.toLowerCase()
    )
    
    if (!event) {
      return `No encontré el evento "${eventName}".`
    }
    
    addFavorite(event.id)
    return `✅ He agregado "${event.title}" a tus favoritos.`
  },
  
  GetFavorites: () => {
    const favorites = getFavorites()
    if (favorites.length === 0) {
      return "No tienes favoritos guardados aún."
    }
    
    const names = favorites.map(id => {
      const event = events.find(e => e.id === id)
      return event?.title
    }).join(", ")
    
    return `Tus favoritos son: ${names}.`
  }
}
```

### Patrón 2: Navegación

**Caso:** Ir a diferentes secciones

```typescript
import { useRouter } from "next/navigation"

// Dentro del componente
const router = useRouter()

const clientTools = {
  NavigateTo: ({ section }: { section: string }) => {
    const routes: Record<string, string> = {
      "carrito": "/cart",
      "mis reservas": "/my-bookings",
      "perfil": "/profile",
      "inicio": "/",
      "eventos": "/events"
    }
    
    const normalizedSection = section.toLowerCase()
    const route = routes[normalizedSection]
    
    if (!route) {
      return `No puedo navegar a "${section}". ¿Quieres ir a: carrito, mis reservas, perfil, o eventos?`
    }
    
    router.push(route)
    return `Llevándote a ${section}...`
  }
}
```

### Patrón 3: Búsqueda y Filtrado

**Caso:** Buscar eventos por criterios

```typescript
const clientTools = {
  SearchEvents: ({ 
    category, 
    dateRange, 
    priceMax 
  }: { 
    category?: string
    dateRange?: string  // "este fin de semana", "próxima semana"
    priceMax?: number 
  }) => {
    let filtered = events
    
    // Filtrar por categoría
    if (category) {
      filtered = filtered.filter(e => 
        e.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Filtrar por precio
    if (priceMax) {
      filtered = filtered.filter(e => e.price <= priceMax)
    }
    
    // Filtrar por fecha (simplificado)
    if (dateRange === "este fin de semana") {
      const now = new Date()
      const weekend = [5, 6, 0] // Viernes, Sábado, Domingo
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date)
        return weekend.includes(eventDate.getDay())
      })
    }
    
    if (filtered.length === 0) {
      return "No encontré eventos con esos criterios."
    }
    
    const names = filtered.slice(0, 5).map(e => e.title).join(", ")
    const more = filtered.length > 5 ? ` y ${filtered.length - 5} más` : ""
    
    return `Encontré ${filtered.length} eventos: ${names}${more}.`
  }
}
```

### Patrón 4: Actualización de Estado

**Caso:** Modificar configuración de usuario

```typescript
// store/user-preferences-store.ts
type Preferences = {
  language: "es" | "en"
  notifications: boolean
  theme: "light" | "dark"
}

let _preferences: Preferences = {
  language: "es",
  notifications: true,
  theme: "light"
}

export function updatePreference<K extends keyof Preferences>(
  key: K,
  value: Preferences[K]
) {
  _preferences[key] = value
  localStorage.setItem("preferences", JSON.stringify(_preferences))
  window.dispatchEvent(new CustomEvent("preferences:changed"))
}

// components/widget.tsx
const clientTools = {
  UpdatePreferences: ({ 
    setting, 
    value 
  }: { 
    setting: string
    value: string | boolean 
  }) => {
    const settingsMap: Record<string, keyof Preferences> = {
      "idioma": "language",
      "notificaciones": "notifications",
      "tema": "theme"
    }
    
    const key = settingsMap[setting.toLowerCase()]
    if (!key) {
      return `No reconozco la configuración "${setting}".`
    }
    
    updatePreference(key, value as any)
    return `✅ He actualizado ${setting} a ${value}.`
  }
}
```

### Patrón 5: Operaciones Asíncronas

**Caso:** Consultar disponibilidad en backend

```typescript
const clientTools = {
  CheckAvailability: async ({ 
    eventId, 
    quantity 
  }: { 
    eventId: string
    quantity: number 
  }) => {
    try {
      // Simular llamada a API
      const response = await fetch(`/api/events/${eventId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      })
      
      const data = await response.json()
      
      if (data.available) {
        return `✅ Hay ${data.remaining} tickets disponibles para este evento.`
      } else {
        return `❌ Lo siento, solo quedan ${data.remaining} tickets y solicitaste ${quantity}.`
      }
      
    } catch (error) {
      console.error("Error checking availability:", error)
      return "No pude verificar la disponibilidad en este momento."
    }
  }
}
```

---

## 🎯 Casos de Uso por Módulo

### 1. Módulo de Búsqueda

```typescript
const searchTools = {
  // Buscar por texto
  SearchByKeyword: ({ keyword }: { keyword: string }) => {
    const results = events.filter(e => 
      e.title.toLowerCase().includes(keyword.toLowerCase()) ||
      e.description?.toLowerCase().includes(keyword.toLowerCase())
    )
    return formatSearchResults(results)
  },
  
  // Filtrar por ubicación
  FilterByLocation: ({ city }: { city: string }) => {
    const results = events.filter(e => 
      e.location.toLowerCase().includes(city.toLowerCase())
    )
    return formatSearchResults(results)
  },
  
  // Obtener eventos populares
  GetPopularEvents: () => {
    const popular = events
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 5)
    return formatSearchResults(popular)
  }
}
```

### 2. Módulo de Reservas

```typescript
const bookingTools = {
  // Ver mis reservas
  GetMyBookings: () => {
    const bookings = getBookings() // desde tu store
    if (bookings.length === 0) {
      return "No tienes reservas activas."
    }
    
    const summary = bookings.map(b => 
      `${b.eventName} el ${b.date} - ${b.seats.length} asientos`
    ).join("; ")
    
    return `Tienes ${bookings.length} reservas: ${summary}.`
  },
  
  // Cancelar reserva
  CancelBooking: ({ bookingId }: { bookingId: string }) => {
    const booking = findBooking(bookingId)
    if (!booking) {
      return `No encontré la reserva ${bookingId}.`
    }
    
    if (booking.cancellable) {
      cancelBooking(bookingId)
      return `✅ Tu reserva ${bookingId} ha sido cancelada.`
    } else {
      return `❌ Esta reserva no puede ser cancelada (menos de 24h para el evento).`
    }
  },
  
  // Cambiar asientos
  ChangeSeats: ({ 
    bookingId, 
    newSeats 
  }: { 
    bookingId: string
    newSeats: string[] 
  }) => {
    const booking = findBooking(bookingId)
    if (!booking) {
      return `No encontré la reserva ${bookingId}.`
    }
    
    const available = checkSeatsAvailable(booking.eventId, newSeats)
    if (!available) {
      return "Esos asientos no están disponibles."
    }
    
    updateBookingSeats(bookingId, newSeats)
    return `✅ He cambiado tus asientos a: ${newSeats.join(", ")}.`
  }
}
```

### 3. Módulo de Pagos

```typescript
const paymentTools = {
  // Ver métodos de pago
  GetPaymentMethods: () => {
    const methods = getPaymentMethods()
    if (methods.length === 0) {
      return "No tienes métodos de pago guardados."
    }
    
    const list = methods.map(m => 
      `${m.type} terminada en ${m.lastDigits}`
    ).join(", ")
    
    return `Tus métodos de pago: ${list}.`
  },
  
  // Agregar método de pago
  AddPaymentMethod: ({ 
    cardNumber, 
    expiryDate, 
    cardName 
  }: { 
    cardNumber: string
    expiryDate: string
    cardName: string 
  }) => {
    // Validar formato
    if (!/^\d{16}$/.test(cardNumber)) {
      return "Número de tarjeta inválido. Debe tener 16 dígitos."
    }
    
    addPaymentMethod({
      type: detectCardType(cardNumber),
      lastDigits: cardNumber.slice(-4),
      expiryDate,
      cardName
    })
    
    return `✅ He agregado tu tarjeta terminada en ${cardNumber.slice(-4)}.`
  }
}
```

### 4. Módulo de Perfil

```typescript
const profileTools = {
  // Ver información de perfil
  GetProfileInfo: () => {
    const user = getCurrentUser()
    return `Tu perfil: ${user.name}, email: ${user.email}, teléfono: ${user.phone}.`
  },
  
  // Actualizar información
  UpdateProfile: ({ 
    field, 
    value 
  }: { 
    field: string
    value: string 
  }) => {
    const validFields = ["nombre", "email", "teléfono", "dirección"]
    const normalizedField = field.toLowerCase()
    
    if (!validFields.includes(normalizedField)) {
      return `No puedo actualizar "${field}". Campos válidos: ${validFields.join(", ")}.`
    }
    
    updateUserField(normalizedField, value)
    return `✅ He actualizado tu ${field} a ${value}.`
  }
}
```

### 5. Módulo de Notificaciones

```typescript
const notificationTools = {
  // Configurar alertas
  SetEventAlert: ({ 
    eventName, 
    minutesBefore 
  }: { 
    eventName: string
    minutesBefore: number 
  }) => {
    const event = findEventByName(eventName)
    if (!event) {
      return `No encontré el evento "${eventName}".`
    }
    
    createAlert({
      eventId: event.id,
      triggerTime: calculateAlertTime(event.date, minutesBefore)
    })
    
    return `✅ Te avisaré ${minutesBefore} minutos antes de ${event.title}.`
  },
  
  // Ver notificaciones pendientes
  GetPendingNotifications: () => {
    const notifications = getPendingNotifications()
    if (notifications.length === 0) {
      return "No tienes notificaciones pendientes."
    }
    
    const summary = notifications.map(n => n.message).join("; ")
    return `Tienes ${notifications.length} notificaciones: ${summary}.`
  }
}
```

---

## 🎓 Mejores Prácticas

### 1. Validación Robusta

```typescript
// ❌ MAL
const badTool = ({ email }) => {
  updateEmail(email)
  return "Email actualizado"
}

// ✅ BIEN
const goodTool = ({ email }: { email: string }) => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "❌ Email inválido. Por favor, proporciona un email válido."
  }
  
  try {
    updateEmail(email)
    return `✅ Email actualizado a ${email}.`
  } catch (error) {
    return "❌ Error al actualizar el email. Intenta nuevamente."
  }
}
```

### 2. Respuestas Conversacionales

```typescript
// ❌ MAL - Muy técnico
return "Error 404: Resource not found"

// ✅ BIEN - Conversacional
return "No encontré ese evento. ¿Puedes verificar el nombre?"

// ❌ MAL - Sin contexto
return "Done"

// ✅ BIEN - Con detalles
return "✅ He agregado 3 tickets de 'Concierto de Rock' a tu carrito. Total: $225."
```

### 3. Manejo de Errores Graceful

```typescript
const robustTool = ({ eventId }: { eventId: string }) => {
  try {
    const event = getEventById(eventId)
    
    if (!event) {
      return "No encontré ese evento. ¿Quieres buscar otro?"
    }
    
    if (!event.available) {
      return `"${event.title}" está agotado. ¿Quieres que te avise si hay devoluciones?`
    }
    
    addToCart(event)
    return `✅ Agregado "${event.title}" al carrito.`
    
  } catch (error) {
    console.error("Error in robustTool:", error)
    return "Ocurrió un error. ¿Puedes intentar nuevamente?"
  }
}
```

### 4. Normalización de Entrada

```typescript
const smartSearch = ({ query }: { query: string }) => {
  // Normalizar entrada
  const normalized = query
    .toLowerCase()
    .trim()
    .normalize("NFD") // Remover acentos
    .replace(/[\u0300-\u036f]/g, "")
  
  // Buscar con términos alternativos
  const synonyms: Record<string, string[]> = {
    "concierto": ["show", "presentación", "espectáculo"],
    "teatro": ["obra", "pieza teatral"],
    "cine": ["película", "film", "movie"]
  }
  
  // Lógica de búsqueda inteligente
  // ...
}
```

### 5. Logging y Debugging

```typescript
const monitoredTool = (params: any) => {
  console.log("🎤 Tool invoked:", {
    tool: "MonitoredTool",
    params,
    timestamp: new Date().toISOString()
  })
  
  try {
    const result = performAction(params)
    
    console.log("✅ Tool succeeded:", {
      tool: "MonitoredTool",
      result
    })
    
    return result
    
  } catch (error) {
    console.error("❌ Tool failed:", {
      tool: "MonitoredTool",
      error: error.message,
      stack: error.stack
    })
    
    return "Ocurrió un error. Por favor, intenta nuevamente."
  }
}
```

### 6. Testing

```typescript
// test/widget-tools.test.ts
import { clientTools } from "@/components/widget"

describe("AddEventByVoice", () => {
  it("should add event to cart", () => {
    const result = clientTools.AddEventByVoice({
      nombre: "Concierto de Rock",
      quantity: 2
    })
    
    expect(result).toContain("agregado")
    expect(getItemsCount()).toBe(2)
  })
  
  it("should handle non-existent event", () => {
    const result = clientTools.AddEventByVoice({
      nombre: "Evento Inexistente",
      quantity: 1
    })
    
    expect(result).toContain("No encontré")
  })
})
```

---

## 🐛 Troubleshooting

### Problema 1: Tool no se invoca

**Síntomas:** El agente responde pero no ejecuta la acción.

**Posibles causas:**
1. Tool no registrado correctamente
2. Nombre del tool no coincide con la configuración del agente
3. Parámetros no coinciden con el schema

**Solución:**
```typescript
// Verificar que el tool esté registrado
useRegisterConvaiTools(clientTools)

// Agregar logging
const myTool = (params) => {
  console.log("🔍 Tool invoked with:", params)
  // ...
}
```

### Problema 2: Parámetros indefinidos

**Síntomas:** `params` es `undefined` o `null`.

**Solución:**
```typescript
// Agregar valores por defecto
const myTool = ({ 
  param1 = "default", 
  param2 = 1 
}: { 
  param1?: string
  param2?: number 
}) => {
  console.log("Received:", { param1, param2 })
  // ...
}
```

### Problema 3: Estado no se actualiza

**Síntomas:** El tool se ejecuta pero la UI no refleja cambios.

**Solución:**
```typescript
// Asegurar que se dispare el evento
function updateState(newData) {
  setState(newData)
  
  // Disparar evento personalizado
  window.dispatchEvent(
    new CustomEvent("state:changed", { detail: newData })
  )
}

// En el componente
useEffect(() => {
  const handler = () => loadState()
  window.addEventListener("state:changed", handler)
  return () => window.removeEventListener("state:changed", handler)
}, [])
```

### Problema 4: Errores no se muestran

**Síntomas:** El agente dice "Ocurrió un error" sin detalles.

**Solución:**
```typescript
// Agregar logging detallado
const myTool = (params) => {
  try {
    // ...
  } catch (error) {
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      params
    })
    
    // Retornar mensaje específico
    return `Error: ${error.message}. Por favor, contacta soporte.`
  }
}
```

---

## 📚 Recursos de ElevenLabs

### Documentación Oficial

1. **Convai Widget Documentation**
   - URL: https://elevenlabs.io/docs/conversational-ai/widget
   - Contenido: Setup, configuración, customización del widget

2. **Client Tools Guide**
   - URL: https://elevenlabs.io/docs/conversational-ai/client-tools
   - Contenido: Cómo definir y registrar client tools

3. **Agent Configuration**
   - URL: https://elevenlabs.io/docs/conversational-ai/agents
   - Contenido: Configurar el comportamiento del agente, prompt engineering

### Capacidades del Agente

#### 1. Procesamiento de Lenguaje Natural
- **Extracción de entidades:** Nombres, fechas, números, ubicaciones
- **Análisis de intención:** Entender qué quiere hacer el usuario
- **Contexto conversacional:** Recordar información de mensajes anteriores

#### 2. Parámetros Soportados
```typescript
type SupportedParams = {
  string: string          // Texto libre
  number: number          // Números enteros o decimales
  boolean: boolean        // true/false
  array: any[]           // Listas
  object: { [key: string]: any }  // Objetos complejos
}
```

#### 3. Capacidades Multimodales
- **Entrada:** Voz, texto
- **Salida:** Voz sintetizada, texto
- **Emociones:** Tono de voz (alegre, serio, empático)

### Configuración Avanzada

#### Prompt Engineering para el Agente

```yaml
# En el dashboard de ElevenLabs
System Prompt: |
  Eres un asistente virtual de AudienceView, una plataforma de venta de tickets.
  
  Tus capacidades:
  - Agregar eventos al carrito
  - Buscar eventos por categoría, fecha, o ubicación
  - Gestionar reservas (ver, cancelar, modificar)
  - Actualizar información de perfil
  
  Directrices:
  - Sé amigable y conversacional
  - Si no entiendes algo, pide clarificación
  - Confirma acciones importantes antes de ejecutarlas
  - Ofrece alternativas si algo no está disponible
  
  Ejemplos de uso:
  - "Agrega 2 tickets para el concierto de rock"
  - "¿Qué eventos hay este fin de semana?"
  - "Cancela mi reserva #12345"
```

#### Configuración de Tools en el Dashboard

```json
{
  "tools": [
    {
      "name": "AddEventByVoice",
      "description": "Agrega un evento al carrito del usuario",
      "parameters": {
        "type": "object",
        "properties": {
          "nombre": {
            "type": "string",
            "description": "Nombre del evento a agregar"
          },
          "quantity": {
            "type": "number",
            "description": "Cantidad de tickets a agregar",
            "minimum": 1,
            "maximum": 10
          }
        },
        "required": ["nombre", "quantity"]
      }
    }
  ]
}
```

### Webhooks y Callbacks

```typescript
// Escuchar eventos del widget
const widget = document.querySelector("elevenlabs-convai")

widget?.addEventListener("conversation:started", () => {
  console.log("💬 Conversación iniciada")
})

widget?.addEventListener("conversation:ended", () => {
  console.log("👋 Conversación terminada")
})

widget?.addEventListener("tool:invoked", (e) => {
  console.log("🔧 Tool invocado:", e.detail)
})
```

---

## 🚀 Ejemplo Completo: Módulo de Recomendaciones

```typescript
// store/recommendations-store.ts
export type Recommendation = {
  id: string
  eventId: string
  reason: string
  score: number
}

let _recommendations: Recommendation[] = []

export function generateRecommendations(userId: string): Recommendation[] {
  // Lógica de ML/algoritmo de recomendación
  const userHistory = getUserPurchaseHistory(userId)
  const preferences = getUserPreferences(userId)
  
  _recommendations = events
    .map(event => ({
      id: `rec-${event.id}`,
      eventId: event.id,
      reason: calculateReason(event, userHistory, preferences),
      score: calculateScore(event, userHistory, preferences)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
  
  return _recommendations
}

// components/widget.tsx
const recommendationTools = {
  GetRecommendations: ({ count = 3 }: { count?: number }) => {
    const userId = getCurrentUserId()
    const recommendations = generateRecommendations(userId)
    
    if (recommendations.length === 0) {
      return "No tengo recomendaciones en este momento. ¿Qué tipo de eventos te interesan?"
    }
    
    const top = recommendations.slice(0, count)
    const list = top.map(rec => {
      const event = events.find(e => e.id === rec.eventId)
      return `"${event?.title}" - ${rec.reason}`
    }).join("; ")
    
    return `Te recomiendo estos eventos: ${list}.`
  },
  
  ExplainRecommendation: ({ eventName }: { eventName: string }) => {
    const event = events.find(e => 
      e.title.toLowerCase() === eventName.toLowerCase()
    )
    
    if (!event) {
      return `No encontré el evento "${eventName}".`
    }
    
    const rec = _recommendations.find(r => r.eventId === event.id)
    
    if (!rec) {
      return `"${event.title}" no está en tus recomendaciones actuales.`
    }
    
    return `Te recomiendo "${event.title}" porque ${rec.reason}.`
  },
  
  RefreshRecommendations: () => {
    const userId = getCurrentUserId()
    generateRecommendations(userId)
    return "He actualizado tus recomendaciones basándome en tu actividad reciente."
  }
}

// Combinar todos los tools
export const clientTools = {
  ...cartTools,
  ...searchTools,
  ...bookingTools,
  ...recommendationTools
}
```

---

## 📊 Métricas y Analytics

```typescript
// lib/analytics.ts
export function trackToolUsage(
  toolName: string,
  params: any,
  result: string,
  success: boolean
) {
  const event = {
    type: "tool:usage",
    tool: toolName,
    params,
    result,
    success,
    timestamp: Date.now(),
    userId: getCurrentUserId()
  }
  
  // Enviar a tu sistema de analytics
  sendToAnalytics(event)
  
  // Guardar localmente para debugging
  const history = JSON.parse(
    localStorage.getItem("tool:history") || "[]"
  )
  history.push(event)
  localStorage.setItem("tool:history", JSON.stringify(history.slice(-100)))
}

// Usar en tus tools
const analyticsWrappedTool = (params: any) => {
  try {
    const result = myTool(params)
    trackToolUsage("myTool", params, result, true)
    return result
  } catch (error) {
    trackToolUsage("myTool", params, error.message, false)
    throw error
  }
}
```

---

## ✅ Checklist para Nuevas Funcionalidades

- [ ] **Definir el caso de uso**
  - ¿Qué problema resuelve?
  - ¿Cómo lo haría el usuario manualmente?

- [ ] **Diseñar el store** (si aplica)
  - Tipo de datos
  - Funciones de lectura/escritura
  - Persistencia
  - Eventos de cambio

- [ ] **Crear el client tool**
  - Validación de parámetros
  - Lógica de negocio
  - Manejo de errores
  - Respuestas conversacionales

- [ ] **Configurar el agente**
  - Actualizar system prompt
  - Definir schema del tool en dashboard
  - Agregar ejemplos de uso

- [ ] **Integrar con UI**
  - Suscribirse a eventos
  - Actualizar estado reactivamente
  - Mostrar feedback visual

- [ ] **Testing**
  - Unit tests del tool
  - Integration tests del flujo
  - Testing manual con diferentes frases

- [ ] **Logging y monitoring**
  - Console.logs para debugging
  - Analytics de uso
  - Error tracking

- [ ] **Documentación**
  - Comentarios en código
  - Actualizar esta guía
  - Ejemplos de frases que funcionan

---

## 🎯 Conclusión

Con esta guía tienes las herramientas para extender ElevenLabs a cualquier módulo de tu aplicación. Recuerda:

1. **Empieza simple:** Un tool básico que funciona es mejor que uno complejo que falla
2. **Itera:** Mejora basándote en cómo los usuarios realmente usan el agente
3. **Valida:** Siempre valida inputs y maneja errores gracefully
4. **Monitorea:** Trackea el uso para entender qué funciona y qué no
5. **Documenta:** Mantén esta guía actualizada con nuevos patrones que descubras

¡Buena suerte construyendo funcionalidades conversacionales increíbles! 🚀
