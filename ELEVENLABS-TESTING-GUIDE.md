# 🧪 Guía Rápida de Testing - ElevenLabs

## ⚡ TESTS RÁPIDOS (5 minutos)

### Pre-requisito
- ✅ Tools configurados en dashboard ElevenLabs
- ✅ System prompt actualizado
- ✅ Aplicación corriendo en http://localhost:3000

---

## 1️⃣ Test: Agregar Evento al Carrito

**Comando de voz:**
```
"Agrega Campeonato de Fútbol"
```

**Respuesta esperada:**
```
✅ He agregado 1 ticket de "Campeonato de Fútbol" al carrito. 
Total en carrito: 1 tickets.
```

**Verificación visual:**
- [ ] Número en header del carrito cambió a (1)
- [ ] Abrir /cart y ver el evento agregado

**Console logs esperados:**
```
🎤 [AddEventByVoice] Invoked with: { nombre: "Campeonato de Fútbol", quantity: 1 }
🛒 Agregando al carrito por voz: { ... }
```

---

## 2️⃣ Test: Agregar Evento con Búsqueda Fuzzy

**Comando de voz:**
```
"Agrega Concierto"  ← Nombre parcial
```

**Respuesta esperada:**
```
✅ He agregado 1 ticket de "Concierto de Verano" al carrito. 
Total en carrito: 2 tickets.
```

**Verificación:**
- [ ] Encontró "Concierto de Verano" aunque solo dijiste "Concierto"

---

## 3️⃣ Test: Ir a Checkout

**Manual:**
1. Abre http://localhost:3000/cart
2. Click en "Proceder al Checkout"
3. Deberías estar en /checkout con Paso 1 (Selección de Asientos)

---

## 4️⃣ Test: Seleccionar Asientos Válidos

**Comando de voz:**
```
"Selecciona A1"
```

**Respuesta esperada:**
```
✅ Asiento A1 seleccionado. Tienes 1 de 2 asientos seleccionados: A1.
```

**Console logs esperados:**
```
🎤 [SelectSeat] Invoked with: { seatId: "A1" }
📊 Current state: { selectedSeats: [], totalItems: 2, ... }
```

**Verificación visual:**
- [ ] Asiento A1 en UI cambió a color seleccionado
- [ ] Contador muestra "1 de 2 asientos seleccionados"

**Repetir:**
```
"Selecciona A2"
```

**Respuesta esperada:**
```
✅ Asiento A2 seleccionado. Tienes 2 de 2 asientos seleccionados: A1, A2.
```

---

## 5️⃣ Test: Intentar Seleccionar Asiento Inválido

**Comando de voz:**
```
"Selecciona C5"  ← Fila C no disponible
```

**Respuesta esperada:**
```
❌ El asiento C5 no está disponible. Solo las filas A y B están disponibles para ti.
```

**Comando de voz:**
```
"Selecciona A99"  ← Número fuera de rango
```

**Respuesta esperada:**
```
❌ El asiento A99 no existe. Los números de asiento van del 1 al 12.
```

---

## 6️⃣ Test: Continuar al Pago

**Comando de voz:**
```
"Continuar al pago"
```

**Respuesta esperada:**
```
✅ Avanzando al paso de pago. Tus asientos seleccionados son: A1, A2.
```

**Console logs esperados:**
```
🎤 [ContinueToPayment] Invoked
📊 Validation: { seats: ["A1", "A2"], totalItems: 2, valid: true }
✅ Button clicked successfully
```

**Verificación visual:**
- [ ] Avanzó a Paso 2: Método de Pago
- [ ] Se ve formulario de pago

---

## 7️⃣ Test: Seleccionar Método de Pago Guardado

**Comando de voz:**
```
"Usa mi tarjeta guardada"
```

**Respuesta esperada:**
```
✅ He seleccionado tu método de pago guardado (Visa ••••4242). 
¿Deseas realizar el pago?
```

**Console logs esperados:**
```
✅ Saved payment method selected
```

**Verificación visual:**
```
- [ ] Radio button "Visa ••••4242" está seleccionado
- [ ] Formulario de nueva tarjeta NO está visible
```

---

## 8️⃣ Test: Procesar Pago

**Comando de voz:**
```
"Realizar pago"
```

**Respuesta esperada:**
```
✅ Procesando tu pago... Por favor espera un momento.
```

**Console logs esperados:**
```
✅ Payment button clicked
```

**Verificación visual:**
- [ ] Avanzó a Paso 3: Confirmación
- [ ] Se ve mensaje de éxito con número de orden
- [ ] Muestra resumen de compra

---

## 9️⃣ Test: Volver a Asientos (desde Pago)

**Setup:** Estar en Paso 2 (Pago)

**Comando de voz:**
```
"Volver"
```

**Respuesta esperada:**
```
✅ Volviendo a la selección de asientos. Puedes modificar tus asientos seleccionados.
```

**Console logs esperados:**
```
✅ Back button clicked
```

**Verificación visual:**
- [ ] Regresó a Paso 1 (Asientos)
- [ ] Asientos previos siguen seleccionados

---

## 🔟 Test: Navegación desde Confirmación

**Setup:** Estar en Paso 3 (Confirmación)

**Comando de voz opción 1:**
```
"Ir al inicio"
```

**Resultado:**
- [ ] Redirige a /

**Comando de voz opción 2:**
```
"Ver recomendaciones"
```

**Resultado:**
- [ ] Redirige a /recommendations

---

## 🐛 TROUBLESHOOTING

### Si el agente responde "No tengo la capacidad de..."

**Diagnóstico:**
1. Abre F12 → Console
2. Di el comando de nuevo
3. ¿Ves logs con 🎤?
   - **SÍ** → Código funciona, problema en dashboard
   - **NO** → Agente no invoca tool

**Solución si NO ves logs:**
1. Ve al dashboard de ElevenLabs
2. Verifica que el tool esté en la lista
3. Verifica que el system prompt tiene la sección "CRITICAL: Context Awareness"
4. Espera 2 minutos y prueba de nuevo

---

### Si el botón no se hace click

**Diagnóstico:**
1. Abre F12 → Console
2. Ejecuta el comando
3. ¿Ves log "✅ Button clicked successfully"?
   - **SÍ** → Botón se clickeó pero no pasó nada (problema de UI)
   - **NO** → Ves log "⚠️ Button not found or disabled"

**Solución:**
```javascript
// En la consola del navegador, ejecuta:
Array.from(document.querySelectorAll('button')).map(b => b.textContent)
```
Verifica que exista un botón con el texto esperado.

---

### Si los asientos no se ven seleccionados

**Diagnóstico:**
```javascript
// En la consola:
JSON.parse(localStorage.getItem('checkout:state'))
```

Verifica que `selectedSeats` tenga los asientos.

**Si está en localStorage pero no en UI:**
- Problema de sincronización entre store y UI
- Verifica que el evento `checkout:changed` se dispara:

```javascript
window.addEventListener('checkout:changed', () => {
  console.log('🔄 Checkout changed!', JSON.parse(localStorage.getItem('checkout:state')))
})
```

---

## ✅ CHECKLIST FINAL

Después de completar todos los tests:

- [ ] Puedo agregar eventos al carrito por voz
- [ ] Puedo seleccionar asientos válidos (A1-A12, B1-B12)
- [ ] Recibo error con asientos inválidos (C5, A99)
- [ ] Puedo continuar al pago cuando completo asientos
- [ ] Puedo seleccionar método de pago guardado
- [ ] Puedo procesar el pago
- [ ] Puedo volver de pago a asientos
- [ ] Puedo navegar desde confirmación
- [ ] No hay errores en la consola (excepto lint esperados)
- [ ] No hay memory leaks (listeners se limpian correctamente)

---

## 📊 RESULTADO ESPERADO

✅ **10/10 tests pasando**

Si algún test falla:
1. Revisa `/ELEVENLABS-IMPLEMENTATION-FIXES.md` - Sección del error
2. Revisa `/ELEVENLABS-DASHBOARD-SETUP.md` - Configuración
3. Revisa console logs para diagnóstico
4. Verifica que aplicaste TODAS las correcciones

---

**Happy Testing!** 🎉
