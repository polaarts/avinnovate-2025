'use client'


## ✅ Lo que se ha creadoimport { ShoppingCart } from 'lucide-react'

import { Button } from './ui/button'

### 1. **Estructura de Datos y Tipos**import { useCartStore } from '@/store/cart-store'

- ✅ `types/database.types.ts` - Tipos completos de base de datos Supabaseimport { useRouter } from 'next/navigation'

- ✅ `types/index.ts` - Tipos del dominio (Event, Cart, Order, etc.)

- ✅ `lib/validations.ts` - Esquemas de validación con Zodexport default function CartIcon() {

  const router = useRouter()

### 2. **Configuración de Supabase**  const { getCartSummary } = useCartStore()

- ✅ `lib/supabase/client.ts` - Cliente para componentes  const summary = getCartSummary()

- ✅ `lib/supabase/server.ts` - Cliente para Server Actions

- ✅ `lib/supabase/middleware.ts` - Middleware de autenticación  return (

- ✅ `middleware.ts` - Middleware de Next.js con protección de rutas    <Button

- ✅ `supabase/migrations/001_initial_schema.sql` - Esquema completo con RLS      variant="default"

- ✅ `supabase/migrations/002_seed_data.sql` - Datos de ejemplo      size="icon"

      className="relative"

### 3. **State Management (Zustand)**      onClick={() => router.push('/cart')}

- ✅ `store/cart-store.ts` - Store del carrito con cálculos    >

- ✅ `store/voice-store.ts` - Store del asistente de voz      <ShoppingCart className="h-5 w-5" />

      {summary.item_count > 0 && (

### 4. **Server Actions**        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">

- ✅ `app/actions/events.ts` - Obtener y buscar eventos          {summary.item_count}

- ✅ `app/actions/cart.ts` - CRUD de carrito        </span>

- 🔄 `app/actions/queue.ts` - Por crear      )}

- 🔄 `app/actions/checkout.ts` - Por crear    </Button>

- 🔄 `app/actions/orders.ts` - Por crear  )

- 🔄 `app/actions/assistant.ts` - Por crear}


### 5. **Componentes Base**
- ✅ `components/cart-button-interactive.tsx` - Botón para agregar al carrito
- ✅ `components/cart-icon.tsx` - Icono del carrito con contador
- ✅ Componentes UI de Radix ya existentes

### 6. **Configuración**
- ✅ `.env.local.example` - Template de variables de entorno
- ✅ `data/events.json` - Actualizado con datos de ejemplo

## 🎯 Próximos Pasos Inmediatos

### Paso 1: Configurar Supabase

1. **Crear proyecto en Supabase**
   ```
   1. Ve a https://supabase.com
   2. Crea un nuevo proyecto
   3. Espera a que se inicialice (2-3 minutos)
   ```

2. **Ejecutar migraciones**
   ```
   1. Ve a SQL Editor en Supabase Dashboard
   2. Copia y pega supabase/migrations/001_initial_schema.sql
   3. Ejecuta (Run)
   4. Copia y pega supabase/migrations/002_seed_data.sql
   5. Ejecuta (Run)
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copia el archivo de ejemplo
   cp .env.local.example .env.local
   
   # Edita .env.local con tus credenciales de Supabase
   # Settings → API en Supabase Dashboard
   ```

### Paso 2: Configurar ElevenLabs

1. **Crear cuenta en ElevenLabs**
   ```
   1. Ve a https://elevenlabs.io
   2. Regístrate (tienen plan gratuito)
   3. Ve a Settings → API Keys
   4. Genera una nueva API Key
   ```

2. **Elegir una voz**
   ```
   1. Ve a VoiceLab
   2. Elige una voz en español (ej: "Diego - Spanish")
   3. Copia el Voice ID
   4. Agrégalo a .env.local
   ```

### Paso 3: Completar Server Actions Faltantes

Crear estos archivos siguiendo el patrón de `cart.ts`:

#### `app/actions/queue.ts`
```typescript
'use server'
// Funciones para:
// - joinQueue(cartId, preferences)
// - getQueuePosition(queueId)
// - updateQueuePreferences(queueId, preferences)
// - checkQueueStatus(queueId)
```

#### `app/actions/checkout.ts`
```typescript
'use server'
// Funciones para:
// - validateCheckout(queueId)
// - processCheckout(queueId, userInfo, zoneSelections)
// - updateZoneSelection(cartItemId, newZoneId)
```

#### `app/actions/orders.ts`
```typescript
'use server'
// Funciones para:
// - createOrder(cartId, total, items, userInfo)
// - generateQRCode(orderId)
// - getOrders(userId)
// - getOrderById(orderId)
```

#### `app/actions/assistant.ts`
```typescript
'use server'
// Funciones para:
// - createAssistantSession(userId)
// - processVoiceCommand(command, sessionToken)
// - updateContext(sessionToken, context)
// - getSession(sessionToken)
```

### Paso 4: Crear Custom Hooks

#### `hooks/use-cart.ts`
```typescript
'use client'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cart-store'
import { createClient } from '@/lib/supabase/client'

export function useCart(userId?: string) {
  const { cart, setCart, setLoading } = useCartStore()
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // Cargar carrito inicial
    // Suscribirse a cambios en tiempo real
    // Cleanup al desmontar
  }, [userId])

  return { cart, /* más funciones */ }
}
```

#### `hooks/use-queue.ts`
```typescript
'use client'
// Similar a use-cart pero para la cola
// Suscripción a cambios de posición en tiempo real
```

#### `hooks/use-voice-assistant.ts`
```typescript
'use client'
// Hook para integrar ElevenLabs
// - startListening()
// - stopListening()
// - processCommand()
// - speak(text)
```

### Paso 5: Actualizar Componentes Existentes

#### `components/featured-events.tsx`
- Actualizar para usar `getEvents()` de Server Actions
- Agregar botón "Agregar al carrito" con zona seleccionable
- Usar tipos correctos de Event

#### `components/header.tsx`
- Agregar `<CartIcon />` al header
- Agregar botón del asistente de voz (cuando esté listo)

#### `app/page.tsx`
- Conectar con Server Actions en lugar de JSON local
- Mostrar eventos desde Supabase

### Paso 6: Crear Páginas Faltantes

#### `app/events/page.tsx`
```typescript
// Lista completa de eventos con filtros
// Usar SearchFilters y getEvents()
```

#### `app/events/[id]/page.tsx`
```typescript
// Detalle de evento
// Mostrar zonas disponibles
// Botón de agregar al carrito por zona
```

#### Actualizar `app/cart/page.tsx`
```typescript
// Lista de items del carrito
// Actualizar cantidades
// Eliminar items
// Botón "Proceder al pago" → queue
```

#### Actualizar `app/queue/[id]/page.tsx`
```typescript
// Contador regresivo
// Posición en cola
// Formulario de preferencias
// Información personal
// Auto-redirect a checkout cuando sea su turno
```

#### Actualizar `app/checkout/[queueId]/page.tsx`
```typescript
// Formulario de checkout
// Selector de zonas
// Resumen de compra
// Botón "Confirmar compra"
```

#### Crear `app/orders/page.tsx`
```typescript
// Historial de órdenes
```

#### Crear `app/orders/[id]/page.tsx`
```typescript
// Detalle de orden
// Mostrar QR code
```

### Paso 7: Implementar Asistente de Voz

1. **Instalar SDK de ElevenLabs**
   ```bash
   npm install @eleven-labs/sdk
   ```

2. **Crear cliente de ElevenLabs**
   ```typescript
   // lib/elevenlabs/client.ts
   ```

3. **Crear componente del asistente**
   ```typescript
   // components/voice/voice-assistant.tsx
   ```

4. **Integrar análisis de intenciones**
   - Extraer intención del comando
   - Ejecutar acción correspondiente
   - Generar respuesta

## 📊 Checklist Completo

### Backend & Database
- [x] Esquema de base de datos
- [x] Migraciones SQL
- [x] Datos de ejemplo (seed)
- [x] Row Level Security (RLS)
- [ ] Edge Function para gestionar cola

### State Management
- [x] Cart store
- [x] Voice store
- [ ] App store (opcional)

### Server Actions
- [x] Events actions
- [x] Cart actions (básico)
- [ ] Queue actions
- [ ] Checkout actions
- [ ] Orders actions
- [ ] Assistant actions

### Custom Hooks
- [ ] useCart con Realtime
- [ ] useQueue con Realtime
- [ ] useVoiceAssistant
- [ ] useRealtime (genérico)

### Componentes
- [x] Componentes UI base (Radix)
- [x] Cart button
- [x] Cart icon
- [ ] Cart sidebar/page
- [ ] Event cards mejorados
- [ ] Queue counter
- [ ] Checkout form
- [ ] Order QR display
- [ ] Voice assistant UI

### Páginas
- [ ] Events list
- [ ] Event detail
- [ ] Cart page completo
- [ ] Queue page completo
- [ ] Checkout page completo
- [ ] Orders list
- [ ] Order detail

### Integraciones
- [ ] ElevenLabs STT
- [ ] ElevenLabs TTS
- [ ] ElevenLabs Conversational AI
- [ ] Generación de QR codes

### Testing & Deployment
- [ ] Testing local completo
- [ ] Testing de flujo completo
- [ ] Testing del asistente de voz
- [ ] Deploy a Vercel
- [ ] Configurar variables de entorno en producción

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Lint
npm run lint

# Build
npm run build

# Producción local
npm run start

# Limpiar cache
rm -rf .next
```

## 📚 Documentación de Referencia

- [PROMPT-BUILD.md](./PROMPT-BUILD.md) - Especificación completa
- [README-SETUP.md](./README-SETUP.md) - Guía de configuración
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [ElevenLabs Docs](https://elevenlabs.io/docs)
- [Radix UI Docs](https://www.radix-ui.com)
- [Zustand Docs](https://docs.pmnd.rs/zustand)

## 💡 Tips de Desarrollo

1. **Desarrollo Incremental**: Completa una funcionalidad a la vez y pruébala
2. **Usa Supabase Dashboard**: Para ver datos y hacer queries rápidas
3. **Console Logs**: Agrega logs para debugging del asistente de voz
4. **Test Realtime**: Abre múltiples pestañas para ver actualizaciones en tiempo real
5. **Manejo de Errores**: Siempre muestra mensajes amigables al usuario

## 🎯 MVP Scope

Recuerda que esto es un MVP:
- ✅ Compra básica con voz
- ✅ Carrito con Realtime
- ✅ Cola simplificada
- ✅ Checkout sin pagos reales
- ✅ QR de confirmación
- ❌ Pagos reales
- ❌ Selección visual de asientos
- ❌ PDFs de tickets
- ❌ Panel de administración

¡Enfócate en que el flujo principal funcione bien!
