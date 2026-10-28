import type { Settings } from "./types";

export const defaultSettings: Settings = {
  storeName: "Voltia Perú",
  tagline: "Audio, carga y tecnología para tu ritmo",
  logoUrl: "",
  whatsappNumber: "51987654321", // Cambiar por el número comercial con código +51
  currencySymbol: "S/",
  colorPrimary: "#8b5cf6",
  colorSecondary: "#06b6d4",
  colorAccent: "#f472b6",
  colorBackground: "#07070d",
  colorSurface: "#12121c",
  colorText: "#f4f4f7",
  announcement: "⚡ Tecnología en tendencia · Precios en soles · Confirma compatibilidad y entrega por WhatsApp",
  announcementActive: true,
  heroBadge: "Audio y accesorios seleccionados",
  heroTitle: "Tu mundo, a otro",
  heroHighlight: "nivel de sonido",
  heroSubtitle:
    "Descubre audífonos, parlantes Bluetooth, cargadores y baterías portátiles. Compra con precios claros en soles y confirma por WhatsApp compatibilidad, disponibilidad y entrega.",
  heroImage: "/products/xtreme5-oem.jpg",
  heroCta: "Explorar productos",
  orderGreeting: "¡Hola! 👋 Quiero consultar y realizar este pedido en Voltia Perú:",
  orderFooter: "Por favor, confírmame disponibilidad, compatibilidad y opciones de entrega. ¡Gracias!",
  whatsappFloatMessage: "¡Hola! Quiero consultar por los accesorios disponibles en Voltia Perú.",
  thankYouMessage: "¡Gracias! Tu pedido fue registrado. Confirma disponibilidad, compatibilidad y entrega por WhatsApp.",
  shippingCost: 10,
  freeShippingFrom: 120,
  paymentMethods: "Yape, Plin, Transferencia bancaria, Pago contra entrega (consultar cobertura)",
  email: "",
  address: "Atención online · Coordinamos disponibilidad y cobertura de entrega por WhatsApp",
  schedule: "Atención por WhatsApp · Consulta el horario disponible",
  instagram: "",
  facebook: "",
  tiktok: "",
  legalPrivacy: `## 1. Responsable
Voltia Perú ("la Tienda") gestiona los datos personales que el cliente facilita al consultar o realizar un pedido en este sitio.

## 2. Datos que podemos solicitar
Para responder consultas o coordinar una compra podemos pedir nombre, teléfono, ciudad, dirección de entrega y notas sobre el pedido. No solicitamos ni guardamos contraseñas bancarias o datos completos de tarjetas.

## 3. Finalidad y comunicación
Usamos estos datos para atender consultas, confirmar disponibilidad y compatibilidad, preparar pedidos, coordinar pagos y entregas, y brindar atención posventa. El cliente puede iniciar la conversación y confirmar su pedido por WhatsApp.

## 4. Compartición
Compartimos los datos estrictamente necesarios con el proveedor de mensajería elegido para una entrega, cuando corresponda. No vendemos datos personales.

## 5. Conservación y derechos
Conservamos la información solo durante el tiempo necesario para atender la solicitud y cumplir obligaciones aplicables. Para solicitar acceso, corrección o eliminación, escríbenos por el canal de contacto publicado en la tienda.

## 6. Seguridad y cambios
Aplicamos medidas razonables para proteger la información. Esta política puede actualizarse; consulta la versión publicada antes de comprar.`,
  legalCookies: `## ¿Qué son las cookies?
Las cookies son archivos pequeños que el navegador puede guardar para recordar preferencias y ayudar a que el sitio funcione.

## Almacenamiento utilizado
- Cookies técnicas: guardan tu elección del aviso de cookies.
- Almacenamiento local: el carrito se guarda en tu propio navegador para que puedas continuar la compra.
- Sesión de administración: se utiliza una cookie necesaria, protegida, para mantener el acceso del administrador.

## Preferencias y control
El aviso permite aceptar cookies o guardar solo las necesarias. Puedes borrar o bloquear cookies desde las preferencias de tu navegador. Si se desactivan las cookies técnicas, algunas funciones podrían dejar de recordar tus preferencias.

## Servicios externos
Al abrir WhatsApp o enlaces de tiendas externas, esos servicios aplican sus propias políticas de privacidad y cookies.`,
  legalTerms: `## 1. Información del catálogo
Los productos ofrecidos incluyen accesorios de terceros y variantes OEM. Las referencias a marcas, modelos o conectores describen el artículo o su compatibilidad; no implican afiliación, fabricación o autorización de Apple, JBL u otras marcas. Los nombres de marca pertenecen a sus titulares.

## 2. Precios y moneda
Los precios de Voltia están expresados en Soles peruanos (S/). Las referencias a precios externos son solo orientativas, pueden corresponder a productos originales con prestaciones distintas y varían según proveedor, stock y promociones.

## 3. Compatibilidad y especificaciones
Verifica el modelo de tu dispositivo, el conector, los protocolos de carga y las características antes de comprar. Potencias, autonomía, traducción, ANC, resistencia al agua y otras prestaciones de productos OEM dependen de la unidad y de la aplicación indicada por el proveedor; se confirman antes del pago.

## 4. Pedidos
El envío del formulario registra una solicitud y abre WhatsApp con el resumen. La compra queda confirmada cuando la tienda verifica disponibilidad, modelo, precio, forma de pago y entrega con el cliente.

## 5. Envío y pago
La cobertura y el costo final se confirman antes del pago. Los medios de pago y condiciones contra entrega están sujetos a disponibilidad y confirmación.

## 6. Garantía y consultas
La garantía aplicable, accesorios incluidos, cambios y condiciones se confirman antes de cerrar la compra. Contacta a la tienda para recibir las condiciones de la unidad concreta.`,
  legalReturns: `## Cambios y devoluciones
Antes de confirmar el pedido, consulta las condiciones aplicables al producto y a la entrega. Para reportar una falla o un producto distinto al solicitado, contáctanos con el número de pedido y una descripción del inconveniente.

## Para solicitar asistencia
- Conserva el producto, embalaje y accesorios recibidos.
- Incluye el número de pedido y evidencia del problema, si aplica.
- No envíes el producto antes de coordinar el procedimiento por WhatsApp.

## Evaluación
La tienda revisará la solicitud y coordinará la alternativa aplicable, considerando el estado del producto, la garantía ofrecida para esa unidad y las normas de protección al consumidor vigentes.`,
};

export const LEGAL_PAGES = {
  privacidad: { title: "Política de Privacidad", key: "legalPrivacy" },
  cookies: { title: "Política de Cookies", key: "legalCookies" },
  terminos: { title: "Términos y Condiciones", key: "legalTerms" },
  devoluciones: { title: "Cambios y Devoluciones", key: "legalReturns" },
} as const;

export type LegalSlug = keyof typeof LEGAL_PAGES;
