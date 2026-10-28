import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { ensureDb, getSettings } from "@/lib/data";

type Body = {
  customerName?: string;
  phone?: string;
  address?: string;
  city?: string;
  notes?: string;
  paymentMethod?: string;
  items?: { id: number; qty: number; color?: string }[];
};

export async function POST(req: Request) {
  await ensureDb();
  const b = (await req.json().catch(() => ({}))) as Body;
  const name = (b.customerName || "").trim();
  const phone = (b.phone || "").trim();
  if (!name || !phone) return Response.json({ error: "Nombre y teléfono son obligatorios" }, { status: 400 });
  const reqItems = (b.items || []).filter((i) => Number(i.qty) > 0).slice(0, 50);
  if (!reqItems.length) return Response.json({ error: "El carrito está vacío" }, { status: 400 });

  const rows = await db.select().from(products).where(inArray(products.id, reqItems.map((i) => Number(i.id))));
  const items = reqItems
    .map((i) => {
      const p = rows.find((r) => r.id === Number(i.id));
      if (!p || !p.active) return null;
      return { id: p.id, name: p.name, price: Number(p.price), qty: Math.min(99, Math.floor(Number(i.qty))), color: i.color || undefined };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (!items.length) return Response.json({ error: "Productos no disponibles" }, { status: 400 });

  const s = await getSettings();
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = s.freeShippingFrom > 0 && subtotal >= s.freeShippingFrom ? 0 : s.shippingCost;
  const total = subtotal + shipping;

  const [order] = await db
    .insert(orders)
    .values({
      customerName: name,
      phone,
      address: (b.address || "").trim(),
      city: (b.city || "").trim(),
      notes: (b.notes || "").trim(),
      paymentMethod: (b.paymentMethod || "").trim(),
      items,
      total: total.toFixed(2),
    })
    .returning({ id: orders.id });

  const c = s.currencySymbol;
  const lines = [
    s.orderGreeting,
    "",
    `🧾 *Pedido #${order.id}* — ${s.storeName}`,
    "",
    ...items.map((i) => `• ${i.qty} x *${i.name}*${i.color ? ` (${i.color})` : ""} — ${c} ${(i.price * i.qty).toFixed(2)}`),
    "",
    `Subtotal: ${c} ${subtotal.toFixed(2)}`,
    `Envío estimado: ${shipping === 0 ? "sin costo sobre el umbral; confirmar cobertura" : c + " " + shipping.toFixed(2) + " (sujeto a confirmar)"}`,
    `*TOTAL ESTIMADO: ${c} ${total.toFixed(2)}*`, 
    "",
    `👤 Nombre: ${name}`,
    `📱 Teléfono: ${phone}`,
    b.address ? `📍 Dirección: ${b.address}${b.city ? ", " + b.city : ""}` : b.city ? `📍 Ciudad: ${b.city}` : "",
    b.paymentMethod ? `💳 Pago: ${b.paymentMethod}` : "",
    b.notes ? `📝 Notas: ${b.notes}` : "",
    "",
    s.orderFooter,
  ].filter((l, idx, a) => !(l === "" && a[idx - 1] === ""));

  const number = s.whatsappNumber.replace(/\D/g, "");
  const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
  return Response.json({ id: order.id, url });
}
