# Guía de Implementación de ElevenLabs en Next.js

## Introducción

ElevenLabs proporciona un widget conversacional de IA que permite agregar asistentes de voz a tu aplicación Next.js. El widget ofrece capacidades de conversación en tiempo real usando inteligencia artificial de voz de alta calidad.

## Requisitos Previos

- Cuenta de ElevenLabs (https://elevenlabs.io)
- Agent ID de ElevenLabs
- Proyecto Next.js 13+ con App Router

## 1. Configuración Inicial

### 1.1 Obtener Agent ID

1. Inicia sesión en tu cuenta de ElevenLabs
2. Ve a la sección de "Conversational AI" o "Agents"
3. Crea un nuevo agente o selecciona uno existente
4. Copia el Agent ID que se muestra en la configuración del agente

### 1.2 Variables de Entorno

Crea o actualiza tu archivo `.env.local`:

```bash
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

## 2. Implementación Básica del Widget

### 2.1 Crear el Componente del Widget

Crea un archivo `components/elevenlabs-widget.tsx`:

```tsx
'use client';

import { useEffect } from 'react';

interface ElevenLabsWidgetProps {
  agentId: string;
}

export default function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  useEffect(() => {
    // Verificar que el agentId esté disponible
    if (!agentId) {
      console.error('ElevenLabs Agent ID no está configurado');
      return;
    }

    // Cargar el script del widget
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Inicializar el widget después de que el script se haya cargado
      if (window.ElevenLabsWidget) {
        window.ElevenLabsWidget.init({
          agentId: agentId,
        });
      }
    };

    // Cleanup al desmontar el componente
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [agentId]);

  return null;
}

// Agregar tipos para TypeScript
declare global {
  interface Window {
    ElevenLabsWidget?: {
      init: (config: { agentId: string; [key: string]: any }) => void;
      destroy?: () => void;
    };
  }
}
```

### 2.2 Integrar en el Layout

Actualiza tu `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ElevenLabsWidget from "@/components/elevenlabs-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tu Aplicación",
  description: "Aplicación con asistente de voz ElevenLabs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <ElevenLabsWidget
          agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ''}
        />
      </body>
    </html>
  );
}
```

## 3. Configuración Avanzada

### 3.1 Opciones de Personalización

El widget acepta múltiples opciones de configuración:

```tsx
'use client';

import { useEffect } from 'react';

interface ElevenLabsWidgetConfig {
  agentId: string;
  // Personalización visual
  theme?: 'light' | 'dark';
  primaryColor?: string;
  // Comportamiento
  autoStart?: boolean;
  defaultOpen?: boolean;
  // Posición
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  // Avatar
  avatarUrl?: string;
  // Textos
  greeting?: string;
  placeholder?: string;
}

export default function ElevenLabsWidget({
  agentId,
  theme = 'light',
  primaryColor = '#000000',
  autoStart = false,
  defaultOpen = false,
  position = 'bottom-right',
  avatarUrl,
  greeting,
  placeholder,
}: ElevenLabsWidgetConfig) {
  useEffect(() => {
    if (!agentId) {
      console.error('ElevenLabs Agent ID no está configurado');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.ElevenLabsWidget) {
        window.ElevenLabsWidget.init({
          agentId,
          theme,
          primaryColor,
          autoStart,
          defaultOpen,
          position,
          ...(avatarUrl && { avatarUrl }),
          ...(greeting && { greeting }),
          ...(placeholder && { placeholder }),
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [agentId, theme, primaryColor, autoStart, defaultOpen, position, avatarUrl, greeting, placeholder]);

  return null;
}

declare global {
  interface Window {
    ElevenLabsWidget?: {
      init: (config: ElevenLabsWidgetConfig) => void;
      destroy?: () => void;
    };
  }
}
```

### 3.2 Uso con Personalización

```tsx
<ElevenLabsWidget
  agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ''}
  theme="dark"
  primaryColor="#6366f1"
  position="bottom-right"
  greeting="Hola! ¿En qué puedo ayudarte hoy?"
  placeholder="Escribe tu mensaje..."
/>
```

## 4. Integración con Herramientas Personalizadas

### 4.1 Registrar Funciones Personalizadas

Si necesitas que el agente interactúe con tu aplicación (ej: agregar al carrito, navegar, etc.), puedes usar el hook `useRegisterConvaiTools`:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ConvaiTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
  handler: (params: any) => Promise<any>;
}

export function useRegisterConvaiTools() {
  const router = useRouter();

  useEffect(() => {
    const tools: ConvaiTool[] = [
      {
        name: 'navigate',
        description: 'Navigate to a different page in the application',
        parameters: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              description: 'The page to navigate to',
              enum: ['home', 'cart', 'checkout', 'events'],
            },
          },
          required: ['page'],
        },
        handler: async ({ page }: { page: string }) => {
          const routes: Record<string, string> = {
            home: '/',
            cart: '/cart',
            checkout: '/checkout',
            events: '/events',
          };

          const route = routes[page];
          if (route) {
            router.push(route);
            return { success: true, message: `Navigating to ${page}` };
          }
          return { success: false, message: 'Page not found' };
        },
      },
      {
        name: 'add_to_cart',
        description: 'Add an event to the shopping cart',
        parameters: {
          type: 'object',
          properties: {
            eventId: {
              type: 'string',
              description: 'The ID of the event to add',
            },
            quantity: {
              type: 'number',
              description: 'Number of tickets to add',
            },
          },
          required: ['eventId', 'quantity'],
        },
        handler: async ({ eventId, quantity }: { eventId: string; quantity: number }) => {
          // Lógica para agregar al carrito
          console.log(`Adding ${quantity} tickets for event ${eventId}`);
          return {
            success: true,
            message: `Added ${quantity} ticket(s) to cart`
          };
        },
      },
    ];

    // Registrar las herramientas cuando el widget esté disponible
    const registerTools = () => {
      if (window.ElevenLabsWidget?.registerTools) {
        window.ElevenLabsWidget.registerTools(tools);
      }
    };

    // Esperar a que el widget esté disponible
    const checkInterval = setInterval(() => {
      if (window.ElevenLabsWidget) {
        registerTools();
        clearInterval(checkInterval);
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
    };
  }, [router]);
}

// Actualizar tipos globales
declare global {
  interface Window {
    ElevenLabsWidget?: {
      init: (config: any) => void;
      destroy?: () => void;
      registerTools?: (tools: ConvaiTool[]) => void;
    };
  }
}
```

### 4.2 Usar el Hook en el Layout

```tsx
'use client';

import { useRegisterConvaiTools } from '@/hooks/useRegisterConvaiTools';

export default function ElevenLabsProvider({ children }: { children: React.ReactNode }) {
  useRegisterConvaiTools();

  return <>{children}</>;
}
```

## 5. Manejo de Estados y Eventos

### 5.1 Escuchar Eventos del Widget

```tsx
'use client';

import { useEffect } from 'react';

export function useElevenLabsEvents() {
  useEffect(() => {
    const handleConversationStart = () => {
      console.log('Conversación iniciada');
    };

    const handleConversationEnd = () => {
      console.log('Conversación finalizada');
    };

    const handleMessage = (event: CustomEvent) => {
      console.log('Mensaje recibido:', event.detail);
    };

    // Agregar event listeners
    window.addEventListener('elevenlabs:conversation:start', handleConversationStart);
    window.addEventListener('elevenlabs:conversation:end', handleConversationEnd);
    window.addEventListener('elevenlabs:message', handleMessage as EventListener);

    return () => {
      window.removeEventListener('elevenlabs:conversation:start', handleConversationStart);
      window.removeEventListener('elevenlabs:conversation:end', handleConversationEnd);
      window.removeEventListener('elevenlabs:message', handleMessage as EventListener);
    };
  }, []);
}
```

## 6. Mejores Prácticas

### 6.1 Carga Condicional

Solo cargar el widget en producción o según sea necesario:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const shouldShowWidget = process.env.NODE_ENV === 'production' ||
                          process.env.NEXT_PUBLIC_ENABLE_WIDGET === 'true';

  return (
    <html lang="es">
      <body>
        {children}
        {shouldShowWidget && (
          <ElevenLabsWidget
            agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ''}
          />
        )}
      </body>
    </html>
  );
}
```

### 6.2 Manejo de Errores

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function ElevenLabsWidget({ agentId }: { agentId: string }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setError('Agent ID no configurado');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;

    script.onerror = () => {
      setError('Error al cargar el widget de ElevenLabs');
    };

    script.onload = () => {
      try {
        if (window.ElevenLabsWidget) {
          window.ElevenLabsWidget.init({ agentId });
        } else {
          setError('ElevenLabs Widget no disponible');
        }
      } catch (err) {
        setError('Error al inicializar el widget');
        console.error(err);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [agentId]);

  if (error) {
    console.error('ElevenLabs Widget Error:', error);
  }

  return null;
}
```

### 6.3 Optimización de Performance

Para evitar recargas innecesarias del widget:

```tsx
'use client';

import { useEffect, useRef } from 'react';

export default function ElevenLabsWidget({ agentId }: { agentId: string }) {
  const initialized = useRef(false);

  useEffect(() => {
    // Evitar inicialización múltiple
    if (initialized.current || !agentId) return;

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;

    script.onload = () => {
      if (window.ElevenLabsWidget && !initialized.current) {
        window.ElevenLabsWidget.init({ agentId });
        initialized.current = true;
      }
    };

    document.body.appendChild(script);

    return () => {
      // Solo limpiar si el componente se desmonta completamente
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.ElevenLabsWidget?.destroy) {
        window.ElevenLabsWidget.destroy();
      }
      initialized.current = false;
    };
  }, [agentId]);

  return null;
}
```

## 7. Solución de Problemas

### El widget no aparece

- Verifica que el Agent ID sea correcto
- Asegúrate de que el script se cargue correctamente (revisa la consola del navegador)
- Verifica que no haya bloqueadores de contenido interfiriendo

### Problemas con TypeScript

Si TypeScript muestra errores sobre `window.ElevenLabsWidget`, asegúrate de tener las declaraciones globales:

```typescript
// types/elevenlabs.d.ts
declare global {
  interface Window {
    ElevenLabsWidget?: {
      init: (config: any) => void;
      destroy?: () => void;
      registerTools?: (tools: any[]) => void;
    };
  }
}

export {};
```

### El widget no se comunica con la aplicación

- Asegúrate de que las herramientas personalizadas estén registradas antes de usar el widget
- Verifica que los nombres y parámetros de las funciones coincidan con la configuración en ElevenLabs

## 8. Recursos Adicionales

- [Documentación Oficial de ElevenLabs](https://elevenlabs.io/docs)
- [Panel de Control de ElevenLabs](https://elevenlabs.io/app)
- [Ejemplos de Conversational AI](https://elevenlabs.io/conversational-ai)

## 9. Ejemplo Completo

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ElevenLabsWidget from "@/components/elevenlabs-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Aplicación",
  description: "Con asistente de voz ElevenLabs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        {process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID && (
          <ElevenLabsWidget
            agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}
            theme="light"
            primaryColor="#6366f1"
            position="bottom-right"
            greeting="Hola! ¿Cómo puedo ayudarte?"
          />
        )}
      </body>
    </html>
  );
}
```

## Conclusión

Esta guía proporciona una base sólida para implementar el widget de ElevenLabs en tu aplicación Next.js. Puedes personalizar y extender estas implementaciones según las necesidades específicas de tu proyecto.
