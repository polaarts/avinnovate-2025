# Integración de ElevenLabs con el Carrito de Compras

## 📋 Descripción General

Este documento describe la implementación y el flujo de integración entre el agente conversacional de ElevenLabs y el sistema de carrito de compras de AudienceView. La integración permite a los usuarios agregar eventos al carrito mediante comandos de voz a través del widget de IA.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **Widget ElevenLabs** (`/components/widget.tsx`)
2. **Store del Carrito** (`/lib/cartStore.ts`)
3. **Página del Carrito** (`/app/cart/page.tsx`)
4. **Datos de Eventos** (`/data/events.json`)

### Flujo de Datos

```
Usuario (Voz) 
    ↓
ElevenLabs Widget
    ↓
Client Tools (AddEventByVoice)
    ↓
cartStore.addItem()
    ↓
localStorage + Event Dispatch
    ↓
Cart Page (Re-render)
```

---

## 📂 Componente 1: Widget ElevenLabs

**Archivo:** `/components/widget.tsx`

### Propósito
Renderiza el widget conversacional de ElevenLabs y registra las herramientas (tools) que el agente puede invocar.

### Implementación Clave

#### 1. Declaración del Custom Element
```typescript
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
```

#### 2. Client Tools Definidos

##### `AddEventByVoice`
**Parámetros:**
- `nombre` (string): Nombre del evento a agregar
- `quantity` (number): Cantidad de tickets a agregar

**Lógica:**
1. Normaliza el nombre del evento a minúsculas
2. Busca el evento en `events.json` por coincidencia de título
3. Si no encuentra el evento, retorna mensaje de error
4. Si lo encuentra, llama a `addItem()` del cartStore con:
   - `id`: ID del evento
   - `name`: Título del evento
   - `price`: Precio del ticket
   - `quantity`: Cantidad solicitada
   - `image`, `date`, `time`, `location`, `category`: Metadatos del evento
   - `isReserved: true`: Marca que fue agregado por voz

**Retorno:** Mensaje de confirmación o error

```typescript
AddEventByVoice: ({ nombre, quantity }: { nombre: string, quantity: number }) => {
  const evento = (events as any[]).find(
    (ev) => ev.title.toLowerCase() === nombre.toLowerCase()
  )
  
  if (!evento) {
    return `No encontré un evento llamado "${nombre}".`
  }
  
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
  
  return `He agregado "${evento.title}" al carrito.`
}
```

#### 3. Registro de Tools
```typescript
useRegisterConvaiTools(clientTools);
```
Hook personalizado que registra los client tools para que el agente de ElevenLabs pueda invocarlos.

#### 4. Renderizado del Widget
```tsx
<elevenlabs-convai agent-id="agent_9301k9hrshh2fx2rnhbzwz8xd7k6"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

---

## 📦 Componente 2: Cart Store

**Archivo:** `/lib/cartStore.ts`

### Propósito
Gestiona el estado global del carrito de compras con persistencia en `localStorage` y notificaciones reactivas.

### Tipo de Datos

```typescript
export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  date?: string
  time?: string
  location?: string
  category?: string
  isReserved?: boolean  // 🔑 Indica si fue agregado por voz
}
```

### Estado Interno

```typescript
let _items: CartItem[] = []
```

**Hidratación inicial:** Lee de `localStorage` al cargar el módulo en el cliente.

### API Pública

#### `addItem(item: CartItem)`
**Lógica:**
1. Busca si el item ya existe por `id`
2. Si existe: incrementa la cantidad
3. Si no existe: agrega el item al array
4. Persiste en `localStorage`
5. Dispara evento `cart:changed`

```typescript
export function addItem(item: CartItem) {
  const found = _items.find(i => i.id === item.id)
  if (found) {
    found.quantity += item.quantity
  } else {
    _items.push({ ...item })
  }
  persistAndNotify()
}
```

#### `getItems(): CartItem[]`
Retorna el array completo de items.

#### `getItemsCount(): number`
Retorna la suma total de quantities de todos los items.

#### `removeItemByName(name: string)`
Elimina un item del carrito por nombre.

#### `updateQuantity(id: string, qty: number)`
Actualiza la cantidad de un item. Si `qty <= 0`, elimina el item.

#### `subscribeCart(listener: () => void)`
Registra un callback que se ejecuta cuando cambia el carrito.

### Persistencia y Notificaciones

```typescript
function persistAndNotify() {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart:items", JSON.stringify(_items))
    window.dispatchEvent(new CustomEvent("cart:changed"))
  }
  listeners.forEach(fn => fn())
}
```

**Estrategia dual:**
1. **CustomEvent en window:** Para componentes que escuchan con `addEventListener`
2. **Set de listeners:** Para suscripciones directas con `subscribeCart()`

---

## 🛒 Componente 3: Página del Carrito

**Archivo:** `/app/cart/page.tsx`

### Propósito
Interfaz de usuario para visualizar y gestionar los items del carrito.

### Sincronización con el Store

#### 1. Prevención de Hydration Mismatch
```typescript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  const t = setTimeout(() => setMounted(true), 0)
  return () => clearTimeout(t)
}, [])
```

#### 2. Carga Inicial + Suscripción Reactiva
```typescript
useEffect(() => {
  if (!mounted) return

  const load = () => setItems(getItems())
  load()  // Carga inicial

  const unsubscribe = subscribeCart(load)  // Suscripción a cambios
  window.addEventListener("cart:changed", load)  // Fallback con eventos

  return () => {
    unsubscribe()
    window.removeEventListener("cart:changed", load)
  }
}, [mounted])
```

**Doble mecanismo de sincronización:**
- `subscribeCart()`: Suscripción directa al store
- `window.addEventListener("cart:changed")`: Escucha global de eventos

### Visualización de Items Reservados

Los items agregados por voz tienen `isReserved: true` y muestran un badge:

```tsx
{item.isReserved && (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded shadow-sm">
    Reservado
  </span>
)}
```

### Cálculo de Totales

```typescript
const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0)
const serviceFee = 0
const total = subtotal + serviceFee
const totalItems = getItemsCount()
```

### Gestión de Cantidad

```tsx
<Button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
  <Minus className="w-4 h-4" />
</Button>
<span>{item.quantity}</span>
<Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
  <Plus className="w-4 h-4" />
</Button>
```

### Flujo de Checkout

```tsx
<Link href="/queue">
  <Button>Proceder al Pago</Button>
</Link>
```

**Navegación:** `/cart` → `/queue` → `/checkout`

---

## 🔄 Flujo Completo de Integración

### Escenario 1: Usuario Agrega Evento por Voz

```
1. Usuario dice: "Agrega 2 tickets para Concierto de Rock"
   ↓
2. ElevenLabs procesa el audio y extrae:
   - nombre: "Concierto de Rock"
   - quantity: 2
   ↓
3. Widget invoca AddEventByVoice({ nombre, quantity })
   ↓
4. AddEventByVoice busca en events.json:
   - Encuentra: { id: "evt-001", title: "Concierto de Rock", price: 75, ... }
   ↓
5. Llama a addItem():
   - Crea CartItem con isReserved: true
   - Agrega o incrementa en _items[]
   ↓
6. persistAndNotify():
   - Guarda en localStorage.setItem("cart:items", ...)
   - Dispara window.dispatchEvent(new CustomEvent("cart:changed"))
   - Ejecuta listeners registrados
   ↓
7. Cart Page detecta el cambio:
   - addEventListener("cart:changed") ejecuta load()
   - load() llama a setItems(getItems())
   ↓
8. React re-renderiza Cart Page:
   - Muestra el nuevo item con badge "Reservado"
   - Actualiza el contador de items
   - Recalcula totales
```

### Escenario 2: Usuario Modifica Cantidad en la UI

```
1. Usuario hace clic en botón "+"
   ↓
2. onClick ejecuta: updateQuantity(item.id, item.quantity + 1)
   ↓
3. updateQuantity() modifica _items:
   - Encuentra el item por id
   - Incrementa quantity
   ↓
4. persistAndNotify() guarda y notifica
   ↓
5. Cart Page se actualiza automáticamente
```

---

## 🔑 Puntos Clave de la Implementación

### 1. Separación de Responsabilidades
- **Widget:** Interfaz con ElevenLabs + lógica de tools
- **Store:** Estado global + persistencia
- **Page:** Visualización + interacción de usuario

### 2. Persistencia Robusta
- `localStorage` para sobrevivir recargas de página
- Hidratación al inicializar el módulo

### 3. Reactividad Dual
- **CustomEvents:** Para escucha global y cross-component
- **Subscriptores directos:** Para eficiencia y control granular

### 4. Normalización de Datos
- Búsqueda case-insensitive: `.toLowerCase()`
- Campos opcionales con `?` en TypeScript

### 5. Marcado de Origen
- `isReserved: true` identifica items agregados por voz
- Permite lógica diferenciada (ej: no permitir eliminación, prioridad en cola)

---

## 🚀 Extensiones Futuras

### Posibles Mejoras

1. **Validación de Stock**
   - Verificar disponibilidad antes de agregar al carrito
   - Sincronizar con backend en tiempo real

2. **Historial de Conversaciones**
   - Almacenar interacciones del usuario con el agente
   - Analítica de patrones de compra por voz

3. **Confirmación por Voz**
   - "¿Estás seguro de agregar 5 tickets?"
   - Reducir errores de interpretación

4. **Multi-idioma**
   - Detección automática de idioma del usuario
   - Búsqueda multilingüe en events.json

5. **Integración con Calendario**
   - "Agregar eventos disponibles este fin de semana"
   - Filtrado temporal por voz

---

## 📊 Diagrama de Dependencias

```
┌─────────────────────┐
│   events.json       │
│   (Fuente de datos) │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   widget.tsx        │
│  - AddEventByVoice  │
│  - useRegisterTools │
└──────────┬──────────┘
           │ addItem()
           ↓
┌─────────────────────┐
│   cartStore.ts      │
│  - _items[]         │
│  - persistAndNotify │
└──────────┬──────────┘
           │ getItems()
           │ subscribeCart()
           ↓
┌─────────────────────┐
│   cart/page.tsx     │
│  - Renderizado      │
│  - Gestión UI       │
└─────────────────────┘
```

---

## 🐛 Debugging

### Verificar Carga de Items
```javascript
// En consola del navegador
localStorage.getItem("cart:items")
```

### Monitorear Eventos
```javascript
window.addEventListener("cart:changed", () => {
  console.log("🛒 Carrito actualizado:", JSON.parse(localStorage.getItem("cart:items")))
})
```

### Verificar State del Widget
```javascript
// En widget.tsx, agregar console.logs
AddEventByVoice: ({ nombre, quantity }) => {
  console.log("🎤 Voz detectada:", { nombre, quantity })
  // ... resto del código
}
```

---

## 📝 Notas Técnicas

### Hydration Mismatch
**Problema:** SSR genera HTML sin items, cliente carga desde localStorage → mismatch.

**Solución:** 
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => setTimeout(() => setMounted(true), 0), [])
```
Espera a que el componente esté montado antes de leer localStorage.

### Type Safety
**CartItem** define el contrato de datos entre widget, store y page.
- Widget construye CartItems válidos desde events.json
- Store garantiza la estructura
- Page confía en los tipos

### Rendimiento
- **Memorización:** Considerar `useMemo` para cálculos de totales
- **Virtualización:** Para carritos con 100+ items, usar react-window
- **Debouncing:** En updateQuantity para reducir writes a localStorage

---

## 📄 Licencia y Créditos

**Plataforma:** AudienceView  
**IA Conversacional:** ElevenLabs  
**Framework:** Next.js 14 con App Router  
**Lenguaje:** TypeScript  
**Última actualización:** Noviembre 2025
