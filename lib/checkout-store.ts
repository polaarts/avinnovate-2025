// /lib/checkout-store.ts
export type CheckoutState = {
  currentStep: number
  selectedSeats: string[]
  useNewPayment: boolean
  newPaymentData: {
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
  }
}

// Estado de módulo
let _state: CheckoutState = {
  currentStep: 1,
  selectedSeats: [],
  useNewPayment: false,
  newPaymentData: {
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  },
}

// Listeners para suscripciones
const listeners = new Set<() => void>()

function persistAndNotify() {
  if (typeof window !== "undefined") {
    localStorage.setItem("checkout:state", JSON.stringify(_state))
    window.dispatchEvent(new CustomEvent("checkout:changed"))
  }
  listeners.forEach((fn) => fn())
}

// ---------- API pública ----------

export function getCheckoutState(): CheckoutState {
  return { ..._state }
}

export function setCurrentStep(step: number) {
  _state.currentStep = step
  persistAndNotify()
}

export function addSeat(seatId: string, maxSeats: number) {
  if (!_state.selectedSeats.includes(seatId) && _state.selectedSeats.length < maxSeats) {
    _state.selectedSeats.push(seatId)
    persistAndNotify()
  }
}

export function removeSeat(seatId: string) {
  _state.selectedSeats = _state.selectedSeats.filter((id) => id !== seatId)
  persistAndNotify()
}

export function clearSeats() {
  _state.selectedSeats = []
  persistAndNotify()
}

export function getSelectedSeats(): string[] {
  return [..._state.selectedSeats]
}

export function setUseNewPayment(value: boolean) {
  _state.useNewPayment = value
  persistAndNotify()
}

export function updatePaymentData(field: keyof CheckoutState["newPaymentData"], value: string) {
  _state.newPaymentData[field] = value
  persistAndNotify()
}

export function getPaymentData() {
  return { ..._state.newPaymentData }
}

export function resetCheckout() {
  _state = {
    currentStep: 1,
    selectedSeats: [],
    useNewPayment: false,
    newPaymentData: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  }
  persistAndNotify()
}

export function subscribeCheckout(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Hidratar desde localStorage al cargar
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("checkout:state")
    if (raw) {
      const parsed = JSON.parse(raw)
      _state = { ..._state, ...parsed }
    }
  } catch {}
}
