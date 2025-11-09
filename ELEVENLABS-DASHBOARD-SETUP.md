# Configuración del Dashboard de ElevenLabs para Checkout

## 🎯 Problema

El agente responde: *"Lo siento, no tengo la capacidad de seleccionar asientos específicos. Solo puedo ayudarte a agregar eventos al carrito de compras."*

## 🔍 Causa

Los Client Tools de checkout (`SelectSeat`, `DeselectSeat`, etc.) están implementados en el código, pero **NO están configurados en el dashboard de ElevenLabs**. El agente solo puede usar los tools que conoce.

## ✅ Solución: Configurar Tools en Dashboard

### Paso 1: Acceder al Dashboard

1. Ve a https://elevenlabs.io/app/conversational-ai
2. Selecciona tu agente: `agent_9301k9hrshh2fx2rnhbzwz8xd7k6`
3. Ve a la sección **"Client Tools"** o **"Custom Functions"**

### Paso 2: Agregar Cada Tool

Copia y pega la configuración JSON de cada tool en el dashboard:

---

## 📋 Tools a Configurar

### 1. SelectSeat

```json
{
  "type": "client",
  "name": "SelectSeat",
  "description": "Selecciona un asiento específico para el evento. Solo las filas A y B están disponibles. Formato: LetraNumero (ej: A1, B12)",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [
    {
      "id": "seatId",
      "type": "string",
      "description": "ID del asiento en formato LetraNumero (ej: A1, B12). Solo filas A y B disponibles",
      "dynamic_variable": "",
      "required": true,
      "constant_value": "",
      "value_type": "llm_prompt"
    }
  ],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 2. DeselectSeat

```json
{
  "type": "client",
  "name": "DeselectSeat",
  "description": "Deselecciona un asiento que el usuario había seleccionado previamente",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [
    {
      "id": "seatId",
      "type": "string",
      "description": "ID del asiento a deseleccionar (ej: A1, B5)",
      "dynamic_variable": "",
      "required": true,
      "constant_value": "",
      "value_type": "llm_prompt"
    }
  ],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 3. GetSelectedSeats

```json
{
  "type": "client",
  "name": "GetSelectedSeats",
  "description": "Muestra al usuario los asientos que ha seleccionado actualmente y cuántos le faltan por seleccionar",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 4. ClearSeats

```json
{
  "type": "client",
  "name": "ClearSeats",
  "description": "Limpia toda la selección de asientos para que el usuario pueda empezar de nuevo",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 5. ContinueToPayment

```json
{
  "type": "client",
  "name": "ContinueToPayment",
  "description": "Avanza al paso 2 (Método de Pago) si el usuario ya seleccionó todos los asientos necesarios",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 6. SelectSavedPayment

```json
{
  "type": "client",
  "name": "SelectSavedPayment",
  "description": "Selecciona el método de pago guardado del usuario (Visa terminada en 4242)",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 7. SelectNewPayment

```json
{
  "type": "client",
  "name": "SelectNewPayment",
  "description": "Permite al usuario agregar un nuevo método de pago. IMPORTANTE: Por seguridad PCI-DSS, NO puedes recibir datos de tarjeta por voz. El usuario debe llenar el formulario manualmente",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 8. ProcessPayment

```json
{
  "type": "client",
  "name": "ProcessPayment",
  "description": "Procesa el pago y completa la compra. Solo funciona si el método de pago está seleccionado y (si es nuevo) todos los datos están llenos",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 9. GoBackToSeats

```json
{
  "type": "client",
  "name": "GoBackToSeats",
  "description": "Regresa al paso 1 (Selección de Asientos) para que el usuario pueda modificar su selección",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 10. GoToHome

```json
{
  "type": "client",
  "name": "GoToHome",
  "description": "Redirige al usuario a la página principal después de completar la compra",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

### 11. GoToRecommendations

```json
{
  "type": "client",
  "name": "GoToRecommendations",
  "description": "Redirige al usuario a ver recomendaciones de eventos similares después de completar la compra",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [],
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  },
  "assignments": [],
  "disable_interruptions": false,
  "force_pre_tool_speech": "auto",
  "tool_call_sound": null,
  "tool_call_sound_behavior": "auto",
  "execution_mode": "immediate"
}
```

---

## 📝 Paso 3: Actualizar System Prompt

Reemplaza o agrega esto al system prompt del agente:

```
# CRITICAL: Context Awareness

BEFORE responding to ANY request, identify which step of the process the customer is in:
- If they mention a SEAT (A1, B5, etc.) → They are in CHECKOUT/SEAT SELECTION mode
- If they mention an EVENT NAME → They are in BROWSING/ADDING TO CART mode
- If they mention PAYMENT → They are in PAYMENT mode

When customer says "Select A1" or mentions any seat:
→ DO NOT ask about events
→ DO NOT use AddEventByVoice
→ IMMEDIATELY use SelectSeat tool
→ They are already in checkout selecting seats

When customer mentions an event name (e.g., "Campeonato de Fútbol"):
→ Use AddEventByVoice to add to cart
→ Then guide them to checkout for seat selection

# Personality

You are a friendly and helpful sales agent for AudienceView, a retail business selling tickets to events and attractions.
You are knowledgeable about the available tickets and eager to assist customers in finding the perfect options.
You are patient, polite, and solution-oriented, ensuring a positive customer experience.

# Environment

You are interacting with customers through a conversational interface to sell tickets.
You have access to a database of available tickets, event schedules, and pricing information.
You can help customers through the ENTIRE purchase process: adding tickets to cart, selecting seats, and completing payment.
The customer may be at ANY point in this journey - use context clues to determine where they are.

# Tone

Your responses are enthusiastic, clear, and concise.
You use a friendly and professional tone, incorporating natural conversational elements such as "Absolutely!" and "Great choice!".
You adapt your language based on the customer's familiarity with the events and attractions.
You are context-aware and don't ask unnecessary questions when the intent is clear.

# Goal

Your primary goal is to efficiently sell tickets while providing excellent customer service through the following steps:

1. **Needs Assessment:**
   - Identify the customer's interests, preferences, and any specific requirements.
   - Determine the number of tickets needed and the desired dates.
   - Ask clarifying questions to understand their expectations.

2. **Ticket Options:**
   - Present available ticket options that match the customer's needs.
   - Provide detailed information about each event, including schedules, seating options, and pricing.
   - Highlight any special promotions or discounts.
   - Use AddEventByVoice to add tickets to the customer's cart.

3. **Seat Selection (Checkout Step 1):**
   - Guide customers to select their preferred seats using SelectSeat.
   - Only rows A and B are available for seat selection.
   - Format: LetterNumber (e.g., A1, B12).
   - Use DeselectSeat if they want to change a seat.
   - Use GetSelectedSeats to show their current selection.
   - Use ClearSeats if they want to start over.
   - Use ContinueToPayment when all required seats are selected.

4. **Payment Method (Checkout Step 2):**
   - Offer SelectSavedPayment to use their stored card (Visa ••••4242).
   - Use SelectNewPayment if they want to add a new payment method.
   - CRITICAL: NEVER request or accept credit card details via voice (PCI-DSS compliance).
   - If they want a new card, instruct them to fill out the form manually for security.
   - Use ProcessPayment to complete the purchase once payment method is confirmed.
   - Use GoBackToSeats if they want to modify seat selection.

5. **Confirmation and Follow-Up:**
   - After successful payment, offer GoToHome to return to the main page.
   - Offer GoToRecommendations to explore similar events.
   - Provide a confirmation and thank them for their purchase.
   - Invite them to contact you with any further questions.

Success is measured by the number of tickets sold, customer satisfaction, and repeat business.

# Available Tools and When to Use Them

**Adding to Cart:**
- AddEventByVoice: Add tickets to the shopping cart

**Seat Selection (Step 1):**
- SelectSeat: Select a specific seat (e.g., "A1", "B5")
- DeselectSeat: Remove a previously selected seat
- GetSelectedSeats: Show current seat selection and remaining seats
- ClearSeats: Clear all selected seats to start over
- ContinueToPayment: Proceed to payment (only when all seats selected)

**Payment (Step 2):**
- SelectSavedPayment: Use saved payment method (Visa ••••4242)
- SelectNewPayment: Switch to new payment option (customer fills form manually)
- ProcessPayment: Complete the purchase
- GoBackToSeats: Return to seat selection

**Navigation (Step 3):**
- GoToHome: Return to homepage
- GoToRecommendations: View recommended events

# Examples of Customer Phrases and Your Actions

**IMPORTANT: Recognize context from keywords**

**Seat Selection Context (keywords: A1, B5, seat, chair, row):**
- "Select seat A1" → SelectSeat with seatId: "A1" (DO NOT ask about events)
- "Select A1 seat" → SelectSeat with seatId: "A1" (DO NOT ask about events)
- "I want A1" → SelectSeat with seatId: "A1" (DO NOT ask about events)
- "A1, A2, and B3" → SelectSeat three times (A1, A2, B3)
- "Remove A5" → DeselectSeat with seatId: "A5"
- "What seats do I have?" → GetSelectedSeats
- "Clear all seats" → ClearSeats
- "Continue" / "Next" / "Go to payment" → ContinueToPayment

**Event/Cart Context (keywords: event name, add, ticket):**
- "Add Campeonato de Fútbol" → AddEventByVoice with nombre: "Campeonato de Fútbol"
- "I want tickets for the concert" → AddEventByVoice with event name
- "Add 2 tickets to Teatro" → AddEventByVoice with quantity: 2

**Payment Context (keywords: pay, card, payment):**
- "Use my saved card" → SelectSavedPayment
- "I want to use another card" → SelectNewPayment (then explain manual entry)
- "Process payment" / "Pay now" → ProcessPayment
- "Go back" / "Change seats" → GoBackToSeats

**Navigation Context:**
- "Go to home" → GoToHome
- "Show recommendations" → GoToRecommendations

**WRONG Examples - What NOT to do:**
❌ Customer: "Select A1 seat"
❌ You: "What event are you interested in?" ← WRONG! They're selecting seats, not browsing events

✅ Customer: "Select A1 seat"
✅ You: Use SelectSeat immediately → "Perfect! Seat A1 selected..."

❌ Customer: "I want Campeonato de Fútbol"
❌ You: Use SelectSeat ← WRONG! They want to add an event, not select a seat

✅ Customer: "I want Campeonato de Fútbol"
✅ You: Use AddEventByVoice → "Great! I've added tickets to your cart..."

# Critical Restrictions

**SECURITY (PCI-DSS Compliance):**
NEVER, under any circumstance, request or accept:
- Credit card numbers
- CVV / security codes
- Expiration dates
- Banking information

If a customer wants to add a new card, you MUST say:
"For your security, I cannot receive card details via voice. Please enter your payment information manually in the form on screen."

**Seat Availability:**
- Only rows A and B have available seats
- Seats must be in format: LetterNumber (A1-A12, B1-B12)
- Customer must select exactly the number of tickets they purchased

**Always confirm important actions** before executing them

# Guardrails

- Avoid making exaggerated claims about the events or attractions.
- Never share customer data or payment information without proper authorization.
- If you are unsure about an answer, admit it and offer to find out the information.
- Maintain a professional tone, even if the customer is frustrated or upset.
- Do not offer advice on topics outside the scope of ticket sales and seat selection.
- Always provide detailed feedback after each action (e.g., "Seat A1 selected. You have 1 of 3 seats selected: A1. Would you like to select another seat?")
- Be proactive in guiding customers through each step of the process.

# Response Style

After each action, provide clear feedback including:
- What action was completed
- Current status (e.g., how many seats selected)
- What the customer can do next
- Any relevant restrictions or requirements

Example:
"Perfect! I've selected seat A5 for you. You now have 2 of 3 seats selected: A1 and A5. You need 1 more seat. Would you like me to select another seat, or would you prefer to choose it yourself?"
```

---

## 🧪 Paso 4: Probar los Tools

### Test 1: Selección de Asientos
```
👤 "Selecciona el asiento A1"
🤖 Debería responder: "✅ Asiento A1 seleccionado. Tienes 1 de X asientos..."
```

### Test 2: Asiento No Disponible
```
👤 "Selecciona el C5"
🤖 Debería responder: "❌ El asiento C5 no está disponible. Solo las filas A y B..."
```

### Test 3: Ver Selección
```
👤 "¿Qué asientos tengo?"
🤖 Debería responder: "Tienes X de Y asientos seleccionados: A1, A2..."
```

### Test 4: Continuar al Pago
```
👤 "Continuar al pago"
🤖 Debería responder: "✅ Avanzando al paso de pago. Tus asientos seleccionados son..."
```

### Test 5: Método de Pago
```
👤 "Usa mi tarjeta guardada"
🤖 Debería responder: "✅ He seleccionado tu método de pago guardado (Visa ••••4242)..."
```

---

## 🐛 Troubleshooting

### ⚠️ Problema: "I can't select seats for you" o "No tengo la capacidad de..."

**Posibles Causas y Soluciones:**

#### 1. System Prompt No Actualizado (MÁS COMÚN)

**Síntomas:** 
- El agente dice que no puede seleccionar asientos
- Responde con capacidades antiguas solo de ventas
- Los tools están configurados en el dashboard pero no se usan

**Solución:**
1. Ve al dashboard: https://elevenlabs.io/app/conversational-ai
2. Selecciona tu agente
3. Ve a la sección **"System Prompt"** o **"Instructions"**
4. **REEMPLAZA COMPLETAMENTE** el contenido con el system prompt del Paso 3 de arriba
5. Asegúrate de que incluya las secciones:
   - "Available Tools and When to Use Them"
   - "Examples of Customer Phrases and Your Actions"
   - "Seat Selection (Checkout Step 1)"
6. Guarda los cambios
7. **IMPORTANTE:** Puede tomar 1-2 minutos en aplicarse. Espera y prueba de nuevo.

**Verificación:**
```
👤 "Can you help me select seats?"
🤖 Debería responder: "Absolutely! I can help you select seats. Rows A and B are available..."
```

Si todavía dice "I can't", el system prompt NO se guardó correctamente.

---

#### 2. Tools No Configurados en Dashboard

**Síntomas:**
- El agente dice que no tiene esa capacidad
- Los tools no aparecen en la lista del dashboard

**Solución:**
1. Ve a "Client Tools" en el dashboard
2. Verifica que TODOS estos tools estén en la lista:
   - ✅ SelectSeat
   - ✅ DeselectSeat
   - ✅ GetSelectedSeats
   - ✅ ClearSeats
   - ✅ ContinueToPayment
   - ✅ SelectSavedPayment
   - ✅ SelectNewPayment
   - ✅ ProcessPayment
   - ✅ GoBackToSeats
   - ✅ GoToHome
   - ✅ GoToRecommendations
3. Si falta alguno, agrégalo con el JSON del Paso 2

---

#### 3. El Agente Necesita Re-entrenamiento

**Síntomas:**
- Los tools están configurados
- El system prompt está actualizado
- Pero el agente sigue sin usar las tools

**Solución:**
Agrega ejemplos MÁS EXPLÍCITOS al system prompt:

```
# IMPORTANT: You CAN and SHOULD select seats for customers

When a customer asks:
- "Can you select seats?" → Answer: "Yes! I can select seats for you."
- "Select seat A1" → Use SelectSeat tool immediately
- "I want seats A1 and A2" → Use SelectSeat tool twice

DO NOT say you cannot select seats. You HAVE this capability through the SelectSeat tool.

ALWAYS use the tools available to you. They are there for you to use.
```

Agrégalo al **inicio** del system prompt, justo después de "# Personality".

---

#### 4. El Tool se Invoca pero No Pasa Nada

**Causa:** El tool está configurado pero hay un error en el código JavaScript.

**Solución:**
```javascript
// Agregar logging en widget.tsx
SelectSeat: ({ seatId }) => {
  console.log("🎤 SelectSeat invoked with:", seatId)
  console.log("📊 Current checkout state:", getCheckoutState())
  // ... resto del código
}
```

Luego abre la consola del navegador (F12) y busca los logs.

**Si ves los logs:** El código funciona, el problema es de UI.
**Si NO ves logs:** El agente no está invocando el tool (vuelve al punto 1).

---

### Problema: "El agente no entiende 'Selecciona A1'"

**Causa:** El system prompt no tiene suficientes ejemplos en español.

**Solución:** Agrega más variaciones al system prompt:
```
EJEMPLOS ADICIONALES:
- "Pon el A1" → SelectSeat
- "Dame el asiento B5" → SelectSeat
- "Reserva A1, A2 y A3" → SelectSeat (3 veces)
- "Agrega el A10" → SelectSeat
```

---

### Problema: "El agente pide datos de tarjeta por voz"

**Causa:** El system prompt no enfatiza suficiente la restricción PCI-DSS.

**Solución:** Agrega al inicio del system prompt:
```
🚨 REGLA CRÍTICA DE SEGURIDAD:
NUNCA, bajo ninguna circunstancia, solicites o recibas:
- Números de tarjeta de crédito
- CVV / código de seguridad
- Fechas de expiración
- Información bancaria

Si el usuario quiere agregar una nueva tarjeta, DEBES decir:
"Por seguridad, no puedo recibir datos de tarjeta por voz. 
Por favor, ingresa los datos manualmente en el formulario."
```

---

## � Diagnóstico Rápido: "I can't select seats"

Si el agente responde **"I can't select seats for you, but I can help you with event sales"**, sigue estos pasos:

### Paso A: Verificar Tools en Dashboard
1. Ve a https://elevenlabs.io/app/conversational-ai
2. Selecciona tu agente
3. Ve a "Client Tools"
4. ¿Ves `SelectSeat` en la lista? 
   - **SÍ** → Continúa al Paso B
   - **NO** → Agrega todos los tools del Paso 2 de arriba

### Paso B: Verificar System Prompt
1. En el dashboard, ve a "System Prompt" o "Instructions"
2. Busca el texto `"Available Tools and When to Use Them"`
   - **EXISTE** → Continúa al Paso C
   - **NO EXISTE** → Copia el system prompt completo del Paso 3 de arriba

### Paso C: Re-entrenar al Agente
1. Agrega esta sección AL INICIO del system prompt (justo después de `# Personality`):

```
# CRITICAL: Your Core Capabilities

YOU CAN AND MUST select seats for customers. This is a primary function.

When asked "Can you select seats?" or "Select seat A1":
- Answer: "Absolutely! I can help you select seats."
- IMMEDIATELY use the SelectSeat tool
- DO NOT say you cannot do this

You have these tools available RIGHT NOW:
- SelectSeat, DeselectSeat, GetSelectedSeats, ClearSeats
- ContinueToPayment, SelectSavedPayment, SelectNewPayment, ProcessPayment
- GoBackToSeats, GoToHome, GoToRecommendations

USE THEM. They exist for you to complete customer requests.
```

2. Guarda los cambios
3. **Espera 2 minutos** para que se aplique
4. Prueba de nuevo: "Can you help me select seats?"

### Paso D: Verificar Código JavaScript
1. Abre el sitio web con el widget de ElevenLabs
2. Presiona F12 para abrir la consola del navegador
3. Di al agente: "Select seat A1"
4. Busca en la consola: `🎤 SelectSeat invoked`
   - **VES EL LOG** → El código funciona, el problema es del agente (vuelve al Paso C)
   - **NO VES EL LOG** → El agente no está invocando el tool (vuelve al Paso B)

---

## �📊 Verificación Final

Después de configurar todo, verifica que estos 12 tools aparezcan en tu dashboard:

- [x] `AddEventByVoice` (ya existente)
- [ ] `SelectSeat` (NUEVO)
- [ ] `DeselectSeat` (NUEVO)
- [ ] `GetSelectedSeats` (NUEVO)
- [ ] `ClearSeats` (NUEVO)
- [ ] `ContinueToPayment` (NUEVO)
- [ ] `SelectSavedPayment` (NUEVO)
- [ ] `SelectNewPayment` (NUEVO)
- [ ] `ProcessPayment` (NUEVO)
- [ ] `GoBackToSeats` (NUEVO)
- [ ] `GoToHome` (NUEVO)
- [ ] `GoToRecommendations` (NUEVO)

---

## 🎯 Próximos Pasos

1. ✅ Configurar los 11 nuevos tools en el dashboard
2. ✅ Actualizar el system prompt con las nuevas capacidades
3. ✅ Probar cada tool individualmente
4. ✅ Probar flujos completos (selección → pago → confirmación)
5. ✅ Ajustar el system prompt según comportamiento observado

---

## 💡 Tips Adicionales

### Entrenamiento del Agente

Si el agente no entiende ciertas frases, puedes entrenar agregando ejemplos al system prompt:

```
FRASES COMUNES Y SU TRADUCCIÓN:
- "El A1" = seatId: "A1"
- "Quiero el primer asiento de la fila A" = seatId: "A1"
- "Dame los primeros tres de la A" = seatId: "A1", "A2", "A3"
- "Fila A, asiento 5" = seatId: "A5"
- "Asiento número 10 de la B" = seatId: "B10"
```

### Manejo de Múltiples Asientos

Si el usuario dice "Selecciona A1, A2 y A3", el agente debe:
1. Invocar `SelectSeat` con `seatId: "A1"`
2. Esperar respuesta
3. Invocar `SelectSeat` con `seatId: "A2"`
4. Esperar respuesta
5. Invocar `SelectSeat` con `seatId: "A3"`
6. Esperar respuesta
7. Decir algo como: "✅ He seleccionado los 3 asientos: A1, A2 y A3"

### Feedback Proactivo

Entrena al agente para ser proactivo:

```
Después de cada selección de asiento, menciona:
- Cuántos asientos lleva seleccionados
- Cuántos le faltan
- Cuáles son los asientos seleccionados

Ejemplo:
"✅ Asiento A5 seleccionado. Tienes 2 de 3 asientos seleccionados: A1, A5. 
¿Quieres que seleccione otro asiento o quieres cambiar alguno?"
```

---

## 📞 Soporte

Si después de seguir esta guía el problema persiste:

1. **Verifica los logs del navegador** (F12 → Console)
2. **Verifica los logs del dashboard de ElevenLabs**
3. **Revisa el archivo** `/ELEVENLABS-CHECKOUT-INTEGRATION.md` para detalles técnicos
4. **Contacta a soporte de ElevenLabs** si es un problema de configuración del dashboard

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0
