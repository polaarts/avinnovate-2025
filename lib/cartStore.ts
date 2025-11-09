// /src/lib/cartStore.ts
export type CartItem = {
  id: string
  name: string      // your <Cart /> uses name
  price: number
  quantity: number
  image?: string
  date?: string
  time?: string
  location?: string
  category?: string
  isReserved?: boolean
}
export type SeatItem = {
    id: string
    name: string
    quantity?: number
}


// ---- module state ----
let _items: CartItem[] = []

let _seats: SeatItem[] = []
let _selectedSeat: SeatItem | null = null

// (optional) hydrate from localStorage on client
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("cart:items")
    if (raw) _items = JSON.parse(raw)
  } catch {}
}

// listeners for subscriptions (alternative to CustomEvent)
const listeners = new Set<() => void>()

function persistAndNotify() {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart:items", JSON.stringify(_items))
    window.dispatchEvent(new CustomEvent("cart:changed")) // already used in <Cart />
  }
  // notify subscribers
  listeners.forEach(fn => fn())
}

// ---------- public API (flat) ----------
export function getItems(): CartItem[] {
  return _items
}

export function getTotal(): number {
  return _items.reduce((acc, it) => acc + it.price * it.quantity, 0)
}

export function addItem(item: CartItem) {
  const found = _items.find(i => i.id === item.id)
  if (found) {
    found.quantity += item.quantity
  } else {
    _items.push({ ...item })
  }
  persistAndNotify()
}

export function removeItemByName(name: string) {
  _items = _items.filter(i => i.name !== name)
  persistAndNotify()
}

export function updateQuantity(id: string, qty: number) {
  if (qty <= 0) {
    _items = _items.filter(i => i.id !== id)
  } else {
    _items = _items.map(i => (i.id === id ? { ...i, quantity: qty } : i))
  }
  persistAndNotify()
}
// Number of items in cart
export function getItemsCount(): number {
  return _items.reduce((acc, it) => acc + it.quantity, 0)
}
// ---------- Functions for selected seat ----------

export function saveSelectedSeat(seat: SeatItem) {
  _selectedSeat = seat
  if (typeof window !== "undefined") {
    localStorage.setItem("cart:selectedSeat", JSON.stringify(_selectedSeat))
    window.dispatchEvent(new CustomEvent("cart:selectedChanged", { detail: _selectedSeat }))
  }
  listeners.forEach(fn => fn())
}

export function getSelectedSeat(): SeatItem | null {
  return _selectedSeat
}

export function removeSelectedSeat() {
  _selectedSeat = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart:selectedSeat")
    window.dispatchEvent(new CustomEvent("cart:selectedChanged", { detail: null }))
  }
  listeners.forEach(fn => fn())
}


// Optional subscription (if you don't want to use window events)
export function subscribeCart(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}