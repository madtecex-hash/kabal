"use client";

import { useState } from "react";
import type { Banner, Order, Product, Settings } from "@/lib/types";
import BannersAdmin from "./BannersAdmin";
import ImageInput from "./ImageInput";
import ProductsAdmin, { F } from "./ProductsAdmin";

type Initial = { settings: Settings; products: Product[]; banners: Banner[]; orders: Order[] };

const TABS = [
  { id: "resumen", label: "📊 Resumen" },
  { id: "pedidos", label: "🧾 Pedidos (WhatsApp)" },
  { id: "productos", label: "🎧 Catálogo de Productos" },
  { id: "banners", label: "🖼️ Banners y Promos" },
  { id: "apariencia", label: "🎨 Colores y Tema" },
  { id: "mensajes", label: "💬 Mensajes de WhatsApp" },
  { id: "tienda", label: "⚙️ Envíos y Pagos (Soles)" },
  { id: "legal", label: "📜 Textos Legales" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const STATUSES = [
  { v: "nuevo", l: "🆕 Nuevo Pedido", c: "bg-blue-500/20 text-blue-300" },
  { v: "confirmado", l: "✅ Confirmado por WhatsApp", c: "bg-emerald-500/20 text-emerald-300" },
  { v: "enviado", l: "🚚 En envío", c: "bg-purple-500/20 text-purple-300" },
  { v: "entregado", l: "📦 Entregado", c: "bg-cyan-500/20 text-cyan-300" },
  { v: "cancelado", l: "❌ Cancelado", c: "bg-rose-500/20 text-rose-300" },
];

const PRESETS = [
  { n: "Cyber Violeta (Actual)", p: "#7c3aed", s: "#06b6d4", a: "#f43f5e", bg: "#09090f", sf: "#13131f", t: "#f8fafc" },
  { n: "Obsidiana Neón", p: "#8b5cf6", s: "#10b981", a: "#f59e0b", bg: "#050508", sf: "#101018", t: "#ffffff" },
  { n: "Azul Eléctrico", p: "#2563eb", s: "#38bdf8", a: "#a855f7", bg: "#050814", sf: "#0b1224", t: "#f0fdf4" },
  { n: "Fuego Naranja", p: "#ea580c", s: "#f59e0b", a: "#ef4444", bg: "#0b0604", sf: "#170f0b", t: "#fff7ed" },
  { n: "Esmeralda Lima", p: "#059669", s: "#10b981", a: "#06b6d4", bg: "#040e0a", sf: "#0c1a14", t: "#ecfdf5" },
];

export default function AdminDashboard({ initial }: { initial: Initial }) {
  const [tab, setTab] = useState<Tab>("resumen");
  const [products, setProducts] = useState(initial.products);
  const [banners, setBanners] = useState(initial.banners);
  const [orders, setOrders] = useState(initial.orders);
  const [s, setS] = useState(initial.settings);
  const [saved, setSaved] = useState(initial.settings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const c = s.currencySymbol || "S/";

  const up = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });

  const saveSettings = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setS(data);
      setSaved(data);
      setToast("✅ Configuración guardada en Soles correctamente");
      setTimeout(() => setToast(""), 2500);

      // Actualizar variables en tiempo real en la página
      const root = document.documentElement.style;
      root.setProperty("--primary", data.colorPrimary);
      root.setProperty("--secondary", data.colorSecondary);
      root.setProperty("--accent", data.colorAccent);
      root.setProperty("--bg", data.colorBackground);
      root.setProperty("--surface", data.colorSurface);
      root.setProperty("--fg", data.colorText);
    }
  };

  const setStatus = async (o: Order, status: string) => {
    await fetch(`/api/admin/orders/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(orders.map((x) => (x.id === o.id ? { ...x, status } : x)));
  };

  const delOrder = async (o: Order) => {
    if (!confirm(`¿Eliminar pedido #${o.id}?`)) return;
    await fetch(`/api/admin/orders/${o.id}`, { method: "DELETE" });
    setOrders(orders.filter((x) => x.id !== o.id));
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const revenue = orders.filter((o) => o.status !== "cancelado").reduce((a, o) => a + o.total, 0);
  const isSettingsTab = ["apariencia", "mensajes", "tienda", "legal"].includes(tab);

  const color = (k: keyof Settings, label: string) => (
    <div className="flex items-center gap-3 glass rounded-2xl p-3 border border-white/10">
      <input
        type="color"
        value={String(s[k])}
        onChange={(e) => up(k, e.target.value as never)}
        className="h-12 w-12 rounded-xl bg-transparent cursor-pointer border border-white/20"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white">{label}</p>
        <input
          className="input !py-1 text-xs mt-1"
          value={String(s[k])}
          onChange={(e) => up(k, e.target.value as never)}
        />
      </div>
    </div>
  );

  return (
    <div className="admin-theme min-h-screen flex flex-col lg:flex-row bg-[#08080d] text-white">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0e0e17] p-5 lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <div className="flex items-center gap-3 mb-6 px-1">
          <span className="h-10 w-10 rounded-2xl bg-gradient-brand text-white grid place-items-center shadow-lg shadow-purple-500/30 font-black">V</span>
          <div className="min-w-0">
            <p className="font-black text-sm text-white truncate">{s.storeName}</p>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Administración · Soles (S/)
            </p>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap text-left rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                tab === t.id
                  ? "bg-gradient-brand text-white shadow-lg shadow-purple-500/25 scale-[1.02]"
                  : "hover:bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {t.label}
              {t.id === "pedidos" && orders.filter((o) => o.status === "nuevo").length > 0 && (
                <span className="ml-2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                  {orders.filter((o) => o.status === "nuevo").length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 hidden lg:flex flex-col gap-2 border-t border-white/5">
          <a
            href="/"
            target="_blank"
            className="rounded-2xl glass px-4 py-2.5 text-xs font-bold text-center text-cyan-300 hover:bg-white/10 border border-white/10 transition-colors"
          >
            🛍️ Ver tienda en vivo
          </a>
          <button
            onClick={logout}
            className="rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 px-4 py-2.5 text-xs font-bold transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl">
        <div className="lg:hidden flex gap-2 mb-4">
          <a
            href="/"
            target="_blank"
            className="rounded-xl glass px-3 py-2 text-xs font-bold text-cyan-300"
          >
            🛍️ Ver tienda
          </a>
          <button
            onClick={logout}
            className="rounded-xl bg-rose-500/15 text-rose-300 px-3 py-2 text-xs font-bold"
          >
            Salir
          </button>
        </div>

        {/* Tab 1: Resumen */}
        {tab === "resumen" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Resumen de la Tienda</h2>
              <p className="text-xs text-white/50">Métricas y pedidos calculados en Soles Peruanos ({c})</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { l: "Pedidos Totales", v: orders.length, color: "text-white" },
                {
                  l: "Por Atender (Nuevos)",
                  v: orders.filter((o) => o.status === "nuevo").length,
                  color: "text-rose-400",
                },
                { l: "Ventas Estimadas", v: `${c} ${revenue.toFixed(2)}`, color: "text-cyan-300" },
                { l: "Modelos Activos", v: products.filter((p) => p.active).length, color: "text-emerald-400" },
              ].map((k) => (
                <div key={k.l} className="glass rounded-3xl p-5 border border-white/10 shadow-lg">
                  <p className="text-xs font-semibold text-white/60">{k.l}</p>
                  <p className={`text-3xl font-black mt-1 ${k.color}`}>{k.v}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-3xl p-6 border border-white/10 space-y-3">
              <p className="font-extrabold text-sm text-white">Alerta de stock bajo</p>
              {products.filter((p) => p.stock <= 5).length === 0 ? (
                <p className="text-xs text-emerald-400 font-semibold">
                  ✓ Todos los audífonos tienen stock suficiente.
                </p>
              ) : (
                <div className="space-y-2">
                  {products
                    .filter((p) => p.stock <= 5)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs"
                      >
                        <span className="font-bold text-white">⚠️ {p.name}</span>
                        <span className="font-extrabold text-amber-300">
                          {p.stock === 0 ? "¡AGOTADO!" : `Solo quedan ${p.stock} unidades`}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Pedidos */}
        {tab === "pedidos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Bandeja de Pedidos</h2>
                <p className="text-xs text-white/50">
                  Pedidos registrados en la web que fueron enviados al WhatsApp oficial.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center border border-white/10">
                <p className="text-4xl mb-2">🧾</p>
                <p className="text-sm font-bold text-white">No hay pedidos registrados todavía</p>
                <p className="text-xs text-white/50 mt-1">
                  Cuando un cliente pulse &apos;Enviar pedido por WhatsApp&apos;, aparecerá aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => {
                  const st = STATUSES.find((x) => x.v === o.status) ?? STATUSES[0];
                  return (
                    <div
                      key={o.id}
                      className="glass rounded-3xl p-5 border border-white/10 space-y-3 hover:border-purple-500/30 transition-all shadow-lg"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-base text-white">
                            Pedido #{o.id}
                            <span className={`ml-2.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${st.c}`}>
                              {st.l}
                            </span>
                          </p>
                          <p className="text-[11px] text-white/40">
                            {new Date(o.createdAt).toLocaleString("es-PE")}
                          </p>
                        </div>
                        <p className="text-xl font-black text-cyan-300">{c} {o.total.toFixed(2)}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/5">
                        <div className="space-y-1 text-white/80">
                          <p><b>Cliente:</b> {o.customerName}</p>
                          <p><b>WhatsApp:</b> {o.phone}</p>
                          <p><b>Destino:</b> {o.city} {o.address ? `— ${o.address}` : ""}</p>
                          {o.paymentMethod && <p><b>Pago:</b> {o.paymentMethod}</p>}
                          {o.notes && <p className="text-amber-300"><b>Notas:</b> {o.notes}</p>}
                        </div>

                        <div className="rounded-2xl bg-white/5 p-3 space-y-1">
                          <p className="font-bold text-white/60 mb-1">Productos:</p>
                          {o.items.map((i, idx) => (
                            <p key={idx} className="text-white/80">
                              • {i.qty}x <b>{i.name}</b> {i.color ? `(${i.color})` : ""} — {c} {(i.price * i.qty).toFixed(2)}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        <select
                          value={o.status}
                          onChange={(e) => setStatus(o, e.target.value)}
                          className="input !w-auto !py-1.5 text-xs font-semibold"
                        >
                          {STATUSES.map((x) => (
                            <option key={x.v} value={x.v}>
                              {x.l}
                            </option>
                          ))}
                        </select>

                        <a
                          href={`https://wa.me/${o.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `¡Hola ${o.customerName}! 👋 Te escribimos de ${s.storeName} respecto a tu pedido #${o.id}. Confirmamos que está en preparación.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                          Chat directo WhatsApp
                        </a>

                        <button
                          onClick={() => delOrder(o)}
                          className="rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 px-3.5 py-1.5 text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors ml-auto"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Productos */}
        {tab === "productos" && (
          <ProductsAdmin products={products} setProducts={setProducts} currency={c} />
        )}

        {/* Tab 4: Banners */}
        {tab === "banners" && (
          <BannersAdmin banners={banners} setBanners={setBanners} />
        )}

        {/* Tab 5: Apariencia */}
        {tab === "apariencia" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Personalizar Colores y Tema</h2>
              <p className="text-xs text-white/50">
                Cambia la identidad visual de la tienda con 1 clic o ajusta cada tono hex.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2.5">
                Paletas predefinidas para Voltia Perú
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.n}
                    type="button"
                    onClick={() =>
                      setS({
                        ...s,
                        colorPrimary: preset.p,
                        colorSecondary: preset.s,
                        colorAccent: preset.a,
                        colorBackground: preset.bg,
                        colorSurface: preset.sf,
                        colorText: preset.t,
                      })
                    }
                    className="glass rounded-2xl p-3.5 text-left border border-white/10 hover:border-cyan-400 transition-all group"
                  >
                    <div className="flex gap-1.5 mb-2.5">
                      {[preset.p, preset.s, preset.a, preset.bg].map((hex) => (
                        <span
                          key={hex}
                          className="h-5 w-5 rounded-full border border-white/20 shadow"
                          style={{ background: hex }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {preset.n}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {color("colorPrimary", "Color Primario (Gradientes y Botones)")}
              {color("colorSecondary", "Color Secundario (Neón Cyan)")}
              {color("colorAccent", "Color de Acento (Ofertas y Badges)")}
              {color("colorBackground", "Fondo Principal")}
              {color("colorSurface", "Tarjetas y Paneles")}
              {color("colorText", "Texto Principal")}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-3">
              <F label="Nombre de la Tienda">
                <input className="input" value={s.storeName} onChange={(e) => up("storeName", e.target.value)} />
              </F>
              <F label="Eslogan">
                <input className="input" value={s.tagline} onChange={(e) => up("tagline", e.target.value)} />
              </F>
            </div>

            <ImageInput label="Logo (opcional)" value={s.logoUrl} onChange={(v) => up("logoUrl", v)} />

            <div className="pt-4 space-y-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white">Textos de la Sección Hero</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <F label="Etiqueta Superior (Badge)">
                  <input className="input" value={s.heroBadge} onChange={(e) => up("heroBadge", e.target.value)} />
                </F>
                <F label="Texto del Botón CTA">
                  <input className="input" value={s.heroCta} onChange={(e) => up("heroCta", e.target.value)} />
                </F>
                <F label="Título Inicial">
                  <input className="input" value={s.heroTitle} onChange={(e) => up("heroTitle", e.target.value)} />
                </F>
                <F label="Título Resaltado (Gradiente)">
                  <input className="input" value={s.heroHighlight} onChange={(e) => up("heroHighlight", e.target.value)} />
                </F>
              </div>
              <F label="Subtítulo">
                <textarea rows={3} className="input" value={s.heroSubtitle} onChange={(e) => up("heroSubtitle", e.target.value)} />
              </F>
              <ImageInput label="Imagen 3D Principal del Hero" value={s.heroImage} onChange={(v) => up("heroImage", v)} />
            </div>
          </div>
        )}

        {/* Tab 6: Mensajes */}
        {tab === "mensajes" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Configurar WhatsApp y Mensajería</h2>
              <p className="text-xs text-white/50">Personaliza los mensajes automáticos que recibirás de los compradores.</p>
            </div>

            <F label="Número de WhatsApp para Pedidos (con código de país Perú: 51XXXXXXXXX)">
              <input className="input" value={s.whatsappNumber} onChange={(e) => up("whatsappNumber", e.target.value)} />
            </F>

            <F label="Saludo inicial del mensaje de pedido">
              <textarea rows={2} className="input" value={s.orderGreeting} onChange={(e) => up("orderGreeting", e.target.value)} />
            </F>

            <F label="Despedida final del mensaje de pedido">
              <textarea rows={2} className="input" value={s.orderFooter} onChange={(e) => up("orderFooter", e.target.value)} />
            </F>

            <F label="Mensaje del botón flotante de WhatsApp">
              <input className="input" value={s.whatsappFloatMessage} onChange={(e) => up("whatsappFloatMessage", e.target.value)} />
            </F>

            <F label="Mensaje de confirmación post-pedido">
              <input className="input" value={s.thankYouMessage} onChange={(e) => up("thankYouMessage", e.target.value)} />
            </F>

            <div className="glass rounded-3xl p-5 border border-white/10 space-y-3">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.announcementActive}
                  onChange={(e) => up("announcementActive", e.target.checked)}
                  className="accent-purple-500 h-4 w-4"
                />
                <span>Mostrar barra superior de anuncios (Marquee)</span>
              </label>
              <F label="Texto de la barra de anuncios">
                <input className="input" value={s.announcement} onChange={(e) => up("announcement", e.target.value)} />
              </F>
            </div>
          </div>
        )}

        {/* Tab 7: Tienda, Pagos y Soles */}
        {tab === "tienda" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Precios en Soles, Envíos y Pagos</h2>
              <p className="text-xs text-white/50">Ajusta los costos logísticos y formas de pago aceptadas en Perú.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <F label="Símbolo de Moneda (ej: S/)">
                <input className="input font-bold" value={s.currencySymbol} onChange={(e) => up("currencySymbol", e.target.value)} />
              </F>
              <F label={`Costo de Envío Base (${c})`}>
                <input
                  type="number"
                  step="0.5"
                  className="input font-bold"
                  value={s.shippingCost}
                  onChange={(e) => up("shippingCost", Number(e.target.value))}
                />
              </F>
              <F label={`Envío GRATIS a partir de (${c})`}>
                <input
                  type="number"
                  step="1"
                  className="input font-bold"
                  value={s.freeShippingFrom}
                  onChange={(e) => up("freeShippingFrom", Number(e.target.value))}
                />
              </F>
            </div>

            <F label="Métodos de Pago Aceptados (separados por coma)">
              <input className="input" value={s.paymentMethods} onChange={(e) => up("paymentMethods", e.target.value)} />
            </F>

            <div className="grid sm:grid-cols-2 gap-4">
              <F label="Correo de Pedidos">
                <input className="input" value={s.email} onChange={(e) => up("email", e.target.value)} />
              </F>
              <F label="Horario de Atención">
                <input className="input" value={s.schedule} onChange={(e) => up("schedule", e.target.value)} />
              </F>
              <F label="Almacén / Cobertura en Perú">
                <input className="input" value={s.address} onChange={(e) => up("address", e.target.value)} />
              </F>
              <F label="Instagram URL">
                <input className="input" value={s.instagram} onChange={(e) => up("instagram", e.target.value)} />
              </F>
              <F label="Facebook URL">
                <input className="input" value={s.facebook} onChange={(e) => up("facebook", e.target.value)} />
              </F>
              <F label="TikTok URL">
                <input className="input" value={s.tiktok} onChange={(e) => up("tiktok", e.target.value)} />
              </F>
            </div>
          </div>
        )}

        {/* Tab 8: Legal */}
        {tab === "legal" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Textos Legales y Cookies</h2>
              <p className="text-xs text-white/50">Edita las políticas de privacidad, cookies y términos para Perú.</p>
            </div>

            <F label="Política de Privacidad (Markdown con ## y -)">
              <textarea rows={10} className="input font-mono text-xs" value={s.legalPrivacy} onChange={(e) => up("legalPrivacy", e.target.value)} />
            </F>

            <F label="Política y Uso de Cookies">
              <textarea rows={10} className="input font-mono text-xs" value={s.legalCookies} onChange={(e) => up("legalCookies", e.target.value)} />
            </F>

            <F label="Términos y Condiciones de Compra">
              <textarea rows={10} className="input font-mono text-xs" value={s.legalTerms} onChange={(e) => up("legalTerms", e.target.value)} />
            </F>

            <F label="Cambios, Devoluciones y Garantía">
              <textarea rows={8} className="input font-mono text-xs" value={s.legalReturns} onChange={(e) => up("legalReturns", e.target.value)} />
            </F>
          </div>
        )}

        {/* Floating Save Button */}
        {isSettingsTab && (
          <div className="sticky bottom-6 mt-8 flex justify-end z-30">
            <button
              type="button"
              onClick={saveSettings}
              disabled={!dirty || saving}
              className="rounded-2xl bg-gradient-brand px-8 py-4 font-black text-white shadow-2xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all text-sm disabled:opacity-40"
            >
              {saving ? "Guardando..." : dirty ? "💾 Guardar cambios en Soles" : "✓ Cambios al día"}
            </button>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 glass rounded-2xl px-6 py-3.5 font-bold text-emerald-300 border border-emerald-500/40 shadow-2xl animate-soft-float">
          {toast}
        </div>
      )}
    </div>
  );
}
