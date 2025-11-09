# Ticketin
## Flujo y Casos de Uso

Este documento describe el flujo principal y los casos de uso de la aplicación Ticketin, una plataforma para la compra de entradas para eventos. A continuación se detallan los pasos que un usuario típico seguiría al interactuar con la aplicación.

- El usuario puede agregar eventos al carrito desde cualquier página clickando en el botón "Agregar" que tiene cada card de evento. Desde la home, categorias, el mismo carrito (el carrito debe mostrar los datos actualizados en todo momento).
- El usuario puede ver el carrito en cualquier momento haciendo click en el icono del carrito en la barra de navegación superior.
- En la página del carrito, el usuario puede ver un resumen de los eventos seleccionados, incluyendo el nombre del evento, la cantidad de entradas seleccionadas, el precio por entrada y el total.
- El usuario puede modificar la cantidad de entradas para cada evento directamente en la página del carrito.
- El usuario puede eliminar eventos del carrito si cambia de opinión.
- El usuario puede proceder a la /queue haciendo click en el botón "Proceder al Pago".
- En la página de /queue, el usuario ve un contador regresivo que indica su posición en la fila para completar la compra. En ese momento, el usuario puede indicarle al asistente de IA que seleccione sus asientos preferidos (por ejemplo, "Prefiero asientos adelante, sección central"). También puede indicar su información personal (nombre, email, etc.) para agilizar el proceso de compra.
- El asistente de IA procesa la solicitud del usuario y selecciona los asientos disponibles según las preferencias indicadas.
- El contador regresivo disminuye hasta llegar a 0, momento en el cual el usuario es redirigido automáticamente a la página de checkout.
- En la página de checkout, el usuario selecciona los asientos desde los sugeridos por el asistente de IA y revisa su información personal.
- El usuario debe ingresar sus datos de pago, la opción por defecto es un método de pago que ya estara guardado en su perfil (tarjeta de crédito/débito). También puede optar por pagar con otros métodos como PayPal o Apple Pay u otro método. El asistente de IA no puede ingresar datos de pago por el usuario, pero puede guiarlo en el proceso.
- El usuario revisa el resumen de la compra, incluyendo los eventos seleccionados, los asientos asignados, el subtotal, las tasas y el total a pagar.
- El usuario confirma la compra haciendo click en el botón "Confirmar Compra".
- La aplicación procesa el pago y muestra una página de confirmación con los detalles de la compra, incluyendo un número de orden y un resumen de los eventos comprados.
- El usuario recibe un correo electrónico con la confirmación de la compra y los tickets electrónicos adjuntos.

Todo este flujo debe ser integrado en endpoints en Next.js, asegurando una experiencia de usuario fluida y segura. Además, se deben manejar adecuadamente los estados de carga, errores y validaciones en cada paso del proceso para garantizar la satisfacción del usuario.

Lo importante de toda esta aplicación es que mediante la voz y la implementación de Elevenlabs, el usuario puede interactuar solo con la voz y el asistente de IA para completar todo el proceso de compra de entradas. Es importante que el asistente haga todo el flujo mediante lo que el usuario le indique por voz, y que el usuario pueda ver en pantalla todo lo que el asistente va haciendo por él.

