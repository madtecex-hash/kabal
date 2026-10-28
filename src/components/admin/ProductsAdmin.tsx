"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ImageInput from "./ImageInput";

type Draft = Omit<Product, "id" | "features" | "colors"> & { id?: number; features: string; colors: string };

const empty: Draft = {
  slug: "",
  name: "",
  brand: "",
  category: "Inalámbricos",
  price: 0,
  comparePrice: null,
  image: "",
  shortDescription: "",
  description: "",
  features: "",
  specs: [],
  colors: "",
  gallery: [],
  bgColor: "#eef2ff",
  badge: "",
  rating: 4.8,
  stock: 10,
  featured: false,
  active: true,
  sortOrder: 0,
};

export default function ProductsAdmin({ products, setProducts, currency }: { products: Product[]; setProducts: (p: Product[]) => void; currency: string }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const edit = (p?: Product) => {
    setErr("");
    setDraft(p ? { ...p, features: p.features.join("\n"), colors: p.colors.join(", ") } : { ...empty, sortOrder: products.length + 1 });
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setErr("");
    const res = await fetch(draft.id ? `/api/admin/products/${draft.id}` : "/api/admin/products", {
      method: draft.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setErr(data.error || "Error");
    setProducts(draft.id ? products.map((p) => (p.id === data.id ? data : p)) : [...products, data]);
    setDraft(null);
  };

  const del = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    setProducts(products.filter((x) => x.id !== p.id));
  };

  const quick = async (p: Product, patch: Partial<Product>) => {
    const next = { ...p, ...patch };
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    if (res.ok) {
      const data = await res.json();
      setProducts(products.map((x) => (x.id === p.id ? data : x)));
    }
  };

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => draft && setDraft({ ...draft, [k]: v });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black">Productos</h2>
          <p className="text-sm text-fg/60">{products.length} productos en la tienda</p>
        </div>
        <button onClick={() => edit()} className="rounded-full bg-gradient-brand px-5 py-2.5 font-bold text-white">+ Añadir producto</button>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className={`glass rounded-2xl p-3 flex flex-wrap items-center gap-4 ${p.active ? "" : "opacity-50"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-[160px]">
              <p className="font-bold">{p.name} {p.featured && <span className="text-xs text-yellow-400">★ Destacado</span>}</p>
              <p className="text-xs text-fg/60">{p.category} · Stock: {p.stock} {p.badge && `· ${p.badge}`}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-secondary">{currency} {p.price.toFixed(2)}</p>
              {p.comparePrice && <p className="text-[10px] text-fg/50">Ref. {currency} {p.comparePrice.toFixed(2)}</p>}
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => quick(p, { active: !p.active })} className="rounded-full glass px-3 py-1.5">{p.active ? "👁 Visible" : "🚫 Oculto"}</button>
              <button onClick={() => quick(p, { featured: !p.featured })} className="rounded-full glass px-3 py-1.5">{p.featured ? "★" : "☆"}</button>
              <button onClick={() => edit(p)} className="rounded-full bg-primary/30 px-3 py-1.5 font-semibold">Editar</button>
              <button onClick={() => del(p)} className="rounded-full bg-red-500/20 text-red-300 px-3 py-1.5">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={() => setDraft(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-surface border border-fg/10 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-4">
            <h3 className="text-xl font-black">{draft.id ? "Editar producto" : "Nuevo producto"}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <F label="Nombre *"><input className="input" value={draft.name} onChange={(e) => set("name", e.target.value)} /></F>
              <F label="Slug (URL) — se genera solo si lo dejas vacío"><input className="input" value={draft.slug} onChange={(e) => set("slug", e.target.value)} /></F>
              <F label="Marca"><input className="input" value={draft.brand} onChange={(e) => set("brand", e.target.value)} /></F>
              <F label="Categoría"><input className="input" list="cats" value={draft.category} onChange={(e) => set("category", e.target.value)} />
                <datalist id="cats">{Array.from(new Set(products.map((p) => p.category))).map((c) => <option key={c} value={c} />)}</datalist>
              </F>
              <F label={`Precio de venta (${currency}) *`}><input type="number" step="0.01" className="input" value={draft.price} onChange={(e) => set("price", Number(e.target.value))} /></F>
              <F label={`Referencia externa opcional (${currency})`}><input type="number" step="0.01" className="input" value={draft.comparePrice ?? ""} onChange={(e) => set("comparePrice", e.target.value ? Number(e.target.value) : null)} /></F>
              <F label="Stock"><input type="number" className="input" value={draft.stock} onChange={(e) => set("stock", Number(e.target.value))} /></F>
              <F label="Etiqueta (ej: 🔥 Más vendido)"><input className="input" value={draft.badge} onChange={(e) => set("badge", e.target.value)} /></F>
              <F label="Valoración (0-5)"><input type="number" step="0.1" className="input" value={draft.rating} onChange={(e) => set("rating", Number(e.target.value))} /></F>
              <F label="Orden"><input type="number" className="input" value={draft.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} /></F>
            </div>
            <ImageInput value={draft.image} onChange={(v) => set("image", v)} label="Imagen principal (vista 1)" />
            <F label="Color de fondo de la placa del producto (se adapta al diseño de la tienda)">
              <div className="flex items-center gap-3">
                <input type="color" value={draft.bgColor} onChange={(e) => set("bgColor", e.target.value)} className="h-10 w-14 rounded-lg bg-transparent cursor-pointer border border-white/20" />
                <input className="input" value={draft.bgColor} onChange={(e) => set("bgColor", e.target.value)} placeholder="#eef2ff" />
              </div>
            </F>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-fg/60">Galería · vistas adicionales (ángulos, lados y detalles, hasta 6)</label>
                <button type="button" onClick={() => set("gallery", [...draft.gallery, ""])} className="text-xs text-secondary font-semibold">+ Añadir vista</button>
              </div>
              <div className="mt-2 space-y-2">
                {draft.gallery.length === 0 && <p className="text-[11px] text-fg/40">Sin vistas adicionales. La vista principal aparecerá como única imagen.</p>}
                {draft.gallery.map((img, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-white/10 p-2">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5 grid place-items-center text-[9px] text-fg/40">
                      {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : "Vista"}
                    </div>
                    <input className="input text-xs" value={img} placeholder="/products/archivo.jpg o URL" onChange={(e) => set("gallery", draft.gallery.map((x, j) => (j === i ? e.target.value : x)))} />
                    <button type="button" onClick={() => set("image", img)} title="Usar como imagen principal" className="text-[11px] rounded-lg bg-primary/25 px-2.5 py-2 whitespace-nowrap">Hacer principal</button>
                    <button type="button" onClick={() => set("gallery", draft.gallery.filter((_, j) => j !== i))} className="text-red-400 px-2" aria-label="Eliminar vista">✕</button>
                  </div>
                ))}
              </div>
            </div>
            <F label="Descripción corta"><input className="input" value={draft.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} /></F>
            <F label="Descripción completa"><textarea rows={4} className="input" value={draft.description} onChange={(e) => set("description", e.target.value)} /></F>
            <div className="grid sm:grid-cols-2 gap-3">
              <F label="Características (una por línea)"><textarea rows={5} className="input" value={draft.features} onChange={(e) => set("features", e.target.value)} /></F>
              <F label="Colores disponibles (separados por coma)"><textarea rows={5} className="input" value={draft.colors} onChange={(e) => set("colors", e.target.value)} /></F>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-fg/60">Especificaciones técnicas</label>
                <button type="button" onClick={() => set("specs", [...draft.specs, { label: "", value: "" }])} className="text-xs text-secondary">+ Añadir</button>
              </div>
              <div className="space-y-2 mt-1">
                {draft.specs.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input className="input" placeholder="Ej: Bluetooth" value={s.label} onChange={(e) => set("specs", draft.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                    <input className="input" placeholder="Ej: 5.3" value={s.value} onChange={(e) => set("specs", draft.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                    <button type="button" onClick={() => set("specs", draft.specs.filter((_, j) => j !== i))} className="px-3 text-red-400">✕</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={draft.active} onChange={(e) => set("active", e.target.checked)} /> Visible en tienda</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} /> Destacado</label>
            </div>
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDraft(null)} className="rounded-full glass px-5 py-2.5">Cancelar</button>
              <button onClick={save} disabled={saving} className="rounded-full bg-gradient-brand px-6 py-2.5 font-bold text-white disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-fg/60">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
