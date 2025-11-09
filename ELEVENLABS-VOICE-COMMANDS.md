# 🎤 Comandos de Voz para Testing - ElevenLabs Checkout

## 🚨 IMPORTANTE: PRIMERO CONFIGURA EL DASHBOARD

Antes de probar estos comandos, **DEBES configurar los Client Tools en el dashboard de ElevenLabs**.

👉 **Lee el archivo:** `ELEVENLABS-DASHBOARD-SETUP.md`

---

## 📋 Comandos para Probar (En Orden)

### 1️⃣ Verificar que el Tool Existe

**Comando de prueba simple:**
```
"¿Puedes seleccionar asientos?"
```

**Respuesta esperada si TODO está bien:**
- ✅ "Sí, puedo ayudarte a seleccionar asientos. ¿Qué asiento quieres?"

**Respuesta si NO está configurado (tu problema actual):**
- ❌ "Lo siento, no tengo la capacidad de seleccionar asientos..."

---

### 2️⃣ Seleccionar un Asiento

**Comandos válidos:**
```
"Selecciona el asiento A1"
"Quiero el asiento B5"
"Dame el A10"
"Pon el asiento A2"
```

**Respuesta esperada:**
```
✅ Asiento A1 seleccionado. Tienes 1 de [X] asientos seleccionados: A1.
```

**Si ves esto en la consola del navegador:**
```
🎤 [SelectSeat] Invoked with: { seatId: "A1" }
📊 Current state: { selectedSeats: [], totalItems: 3, ... }
```
= El tool SÍ está funcionando en el código ✅

---

### 3️⃣ Probar Validaciones

**Asiento en fila no disponible:**
```
"Selecciona el asiento C5"
```

**Respuesta esperada:**
```
❌ El asiento C5 no está disponible. Solo las filas A y B están disponibles para ti.
```

---

**Formato incorrecto:**
```
"Selecciona el asiento AA1"
```

**Respuesta esperada:**
```
❌ Formato de asiento inválido. Usa el formato correcto (ej: A1, B12).
```

---

### 4️⃣ Seleccionar Múltiples Asientos

**Comando:**
```
"Selecciona los asientos A1, A2 y A3"
```

**Comportamiento esperado:**
El agente debe invocar `SelectSeat` 3 veces seguidas y luego responder algo como:
```
✅ He seleccionado los 3 asientos: A1, A2, A3.
```

---

### 5️⃣ Ver Asientos Seleccionados

**Comandos:**
```
"¿Qué asientos tengo seleccionados?"
"Muéstrame mis asientos"
"¿Cuántos asientos he seleccionado?"
```

**Respuesta esperada:**
```
Tienes 3 de 3 asientos seleccionados: A1, A2, A3.
```

---

### 6️⃣ Deseleccionar un Asiento

**Comando:**
```
"Quita el asiento A2"
"Deselecciona el B5"
"Ya no quiero el A1"
```

**Respuesta esperada:**
```
✅ Asiento A2 deseleccionado. Ahora tienes 2 asientos seleccionados: A1, A3.
```

---

### 7️⃣ Limpiar Selección

**Comandos:**
```
"Borra todos los asientos"
"Limpia la selección"
"Quiero empezar de nuevo"
```

**Respuesta esperada:**
```
✅ He limpiado la selección de asientos. Puedes volver a seleccionar.
```

---

### 8️⃣ Continuar al Pago

**Comando:**
```
"Continuar al pago"
"Siguiente paso"
"Ir a pagar"
```

**Respuesta esperada (si todos los asientos están seleccionados):**
```
✅ Avanzando al paso de pago. Tus asientos seleccionados son: A1, A2, A3.
```

**Respuesta esperada (si faltan asientos):**
```
❌ Necesitas seleccionar 3 asientos antes de continuar. Actualmente tienes 2 seleccionados.
```

---

### 9️⃣ Método de Pago Guardado

**Comandos:**
```
"Usa mi tarjeta guardada"
"Pagar con mi método guardado"
"Usar Visa 4242"
```

**Respuesta esperada:**
```
✅ He seleccionado tu método de pago guardado (Visa ••••4242). ¿Deseas realizar el pago?
```

---

### 🔟 Nuevo Método de Pago

**Comandos:**
```
"Quiero usar otra tarjeta"
"Agregar nuevo método de pago"
"Pagar con otra tarjeta"
```

**Respuesta esperada (con advertencia de seguridad):**
```
✅ He seleccionado "Agregar nuevo método de pago". 
Por seguridad, NO puedo recibir los datos de tu tarjeta por voz. 
Por favor, ingresa manualmente:
- Número de tarjeta
- Nombre en la tarjeta
- Fecha de expiración (MM/AA)
- CVV

Cuando termines de llenar los datos, dime "realizar pago".
```

---

### 1️⃣1️⃣ Procesar Pago

**Comandos:**
```
"Realizar el pago"
"Confirmar pago"
"Procesar la compra"
```

**Respuesta esperada:**
```
✅ Procesando tu pago... Por favor espera un momento.
```

*(Después de 2 segundos)*
```
✅ Pago procesado exitosamente. Tu compra ha sido confirmada.
```

---

### 1️⃣2️⃣ Volver a Asientos

**Comandos:**
```
"Volver a los asientos"
"Quiero cambiar los asientos"
"Regresar"
```

**Respuesta esperada:**
```
✅ Volviendo a la selección de asientos. Puedes modificar tus asientos seleccionados.
```

---

### 1️⃣3️⃣ Ir al Inicio

**Comandos:**
```
"Volver al inicio"
"Ir a la página principal"
"Inicio"
```

**Respuesta esperada:**
```
✅ Llevándote a la página de inicio...
```

---

### 1️⃣4️⃣ Ver Recomendaciones

**Comandos:**
```
"Ver recomendaciones"
"Qué otros eventos hay"
"Muéstrame más eventos"
```

**Respuesta esperada:**
```
✅ Llevándote a ver recomendaciones de eventos que podrían interesarte...
```

---

## 🔍 Cómo Diagnosticar Problemas

### Paso 1: Abrir Consola del Navegador

1. Presiona **F12** en tu navegador
2. Ve a la pestaña **"Console"**
3. Di un comando de voz al agente
4. Observa qué aparece en la consola

### Paso 2: Interpretar los Logs

#### ✅ **Si ves esto = TODO FUNCIONA:**
```
🎤 [SelectSeat] Invoked with: { seatId: "A1" }
📊 Current state: { selectedSeats: [], totalItems: 3 }
```

#### ⚠️ **Si NO ves NADA = Tool no configurado:**
- El agente no está invocando el tool
- **Solución:** Configura el tool en el dashboard de ElevenLabs

#### ❌ **Si ves error de JavaScript:**
```
❌ Invalid format: a1
```
- El tool se está invocando pero hay un problema de validación
- **Solución:** Verificar el código en `widget.tsx`

---

## 🎯 Flujo Completo para Probar

Aquí está un flujo completo que puedes seguir para verificar que TODO funciona:

```
1. "Selecciona el asiento A1"
   → Debería confirmar: "✅ Asiento A1 seleccionado..."

2. "Selecciona el A2"
   → Debería confirmar: "✅ Asiento A2 seleccionado..."

3. "Selecciona el A3"
   → Debería confirmar: "✅ Asiento A3 seleccionado..."

4. "¿Qué asientos tengo?"
   → Debería listar: "Tienes 3 de 3 asientos seleccionados: A1, A2, A3"

5. "Quita el A3"
   → Debería confirmar: "✅ Asiento A3 deseleccionado..."

6. "Selecciona el B5"
   → Debería confirmar: "✅ Asiento B5 seleccionado..."

7. "Continuar al pago"
   → Debería avanzar: "✅ Avanzando al paso de pago..."

8. "Usa mi tarjeta guardada"
   → Debería seleccionar: "✅ He seleccionado tu método de pago guardado..."

9. "Realizar el pago"
   → Debería procesar: "✅ Procesando tu pago..."
   → Después: "✅ Pago procesado exitosamente..."

10. "Ver recomendaciones"
    → Debería redirigir: "✅ Llevándote a ver recomendaciones..."
```

---

## 🚨 Problema Actual y Solución

### Tu Error Actual:
```
"Lo siento, no tengo la capacidad de seleccionar asientos específicos. 
Solo puedo ayudarte a agregar eventos al carrito de compras."
```

### Causa:
Los Client Tools de checkout **NO están configurados en el dashboard de ElevenLabs**.

### Solución en 3 Pasos:

1. **Abre el Dashboard de ElevenLabs**
   - Ve a: https://elevenlabs.io/app/conversational-ai
   - Selecciona tu agente

2. **Agrega los 11 Nuevos Tools**
   - Copia cada JSON del archivo `ELEVENLABS-DASHBOARD-SETUP.md`
   - Pega en la sección "Client Tools"

3. **Actualiza el System Prompt**
   - Agrega las nuevas capacidades
   - Incluye ejemplos de comandos
   - Enfatiza las restricciones de seguridad

### Después de Configurar:

1. **Recarga la página** (F5)
2. **Di:** "¿Puedes seleccionar asientos?"
3. **Respuesta esperada:** "Sí, puedo ayudarte a seleccionar asientos..."

---

## 📞 Siguiente Acción

1. ✅ Lee `ELEVENLABS-DASHBOARD-SETUP.md`
2. ✅ Configura los 11 tools en el dashboard
3. ✅ Actualiza el system prompt
4. ✅ Vuelve aquí y prueba los comandos de arriba

---

**Archivo de referencia:** `/ELEVENLABS-DASHBOARD-SETUP.md`  
**Documentación técnica:** `/ELEVENLABS-CHECKOUT-INTEGRATION.md`  
**Última actualización:** Noviembre 2025
