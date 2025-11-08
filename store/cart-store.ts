import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  artist: string
  date: string
  time: string
  location: string
  image: string
  price: number
  quantity: number
  category: string
  isReserved: boolean // Indica si fue reservado por agente de voz o manualmente
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getServiceFee: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        // Items iniciales mockeados
        {
          id: "1",
          title: "Concierto de Verano",
          artist: "The Midnight Echoes",
          date: "15 Dic 2024",
          time: "20:00",
          location: "Estadio Principal",
          image: "/concert-stage-lights.png",
          price: 89.99,
          quantity: 2,
          category: "Música",
          isReserved: false, // Agregado manualmente
        },
        {
          id: "2",
          title: "Obra Teatral Clásica",
          artist: "Teatro Nacional",
          date: "22 Dic 2024",
          time: "19:30",
          location: "Teatro Gran Vía",
          image: "/theater-stage-dramatic-lighting.jpg",
          price: 45.0,
          quantity: 1,
          category: "Teatro",
          isReserved: true // Reservado por agente de voz
        },
        {
          id: "3",
          title: "Campeonato de Fútbol",
          artist: "Liga Profesional",
          date: "28 Dic 2024",
          time: "17:00",
          location: "Estadio Metropolitano",
          image: "/soccer-football-stadium.jpg",
          price: 65.0,
          quantity: 4,
          category: "Deportes",
          isReserved: false, // Agregado manualmente
        },
      ],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((acc, item) => acc + item.quantity, 0)
      },

      getSubtotal: () => {
        const state = get()
        return state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },

      getServiceFee: () => {
        const state = get()
        return state.getSubtotal() * 0.1
      },

      getTotal: () => {
        const state = get()
        return state.getSubtotal() + state.getServiceFee()
      },
    }),
    {
      name: 'cart-storage',
      version: 1, // Incrementar versión para forzar migración
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Migrar datos antiguos agregando isReserved si no existe
          const state = persistedState as { items: Partial<CartItem>[] }
          return {
            ...state,
            items: state.items.map((item: Partial<CartItem>) => ({
              ...item,
              isReserved: item.isReserved ?? false, // Agregar campo si no existe
            })),
          }
        }
        return persistedState
      },
    }
  )
)
