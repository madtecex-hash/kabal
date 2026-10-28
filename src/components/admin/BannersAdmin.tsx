"use client";

import { useState } from "react";
import type { Banner } from "@/lib/types";
import ImageInput from "./ImageInput";
import { F } from "./ProductsAdmin";

type Draft = Omit<Banner, "id"> & { id?: number };

export default function BannersAdmin({ banners, setBanners }: { banners: Banner[]; setBanners: (b: Banner[]) => void }) {
  const [draft, setDraft] = useState<Draft | null>(null);

  const save = async () => {
    if (!draft) return;
    const res = await fetch(draft.id ? `/api/admin/banners/${draft.id}` : "/api/admin/banners", {
      method: draft.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Error");
    setBanners(draft.id ? banners.map((b) => (b.id === data.id ? data : b)) : [...banners, data]);
    setDraft(null);
  };

  const del = async (b: Banner) => {
    if (!confirm("¿Eliminar banner?")) return;
    await fetch(`/api/admin/banners/${b.id}`, { method: "DELETE" });
    setBanners(banners.filter((x) => x.id !== b.id));
  };

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => draft && setDraft({ ...draft, [k]: v });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black">Banners / Promociones</h2>
          <p className="text-sm text-fg/60">Slider de promociones de la página principal</p>
        </div>
        <button
          onClick={() => setDraft({ title: "", subtitle: "", image: "", ctaText: "Comprar ahora", ctaLink: "#catalogo", active: true, sortOrder: banners.length + 1 })}
          className="rounded-full bg-gradient-brand px-5 py-2.5 font-bold text-white"
        >
          + Nuevo banner
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className={`glass rounded-2xl overflow-hidden ${b.active ? "" : "opacity-50"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt="" className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="font-bold">{b.title}</p>
              <p className="text-sm text-fg/60">{b.subtitle}</p>
              <div className="mt-3 flex gap-2 text-xs">
                <button onClick={() => setDraft({ ...b })} className="rounded-full bg-primary/30 px-3 py-1.5 font-semibold">Editar</button>
                <button onClick={() => del(b)} className="rounded-full bg-red-500/20 text-red-300 px-3 py-1.5">Eliminar</button>
                <span className="ml-auto text-fg/50">{b.active ? "Activo" : "Inactivo"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {draft && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={() => setDraft(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-surface border border-fg/10 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 space-y-3">
            <h3 className="text-xl font-black">{draft.id ? "Editar banner" : "Nuevo banner"}</h3>
            <F label="Título *"><input className="input" value={draft.title} onChange={(e) => set("title", e.target.value)} /></F>
            <F label="Subtítulo"><input className="input" value={draft.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></F>
            <ImageInput value={draft.image} onChange={(v) => set("image", v)} />
            <div className="grid grid-cols-2 gap-3">
              <F label="Texto del botón"><input className="input" value={draft.ctaText} onChange={(e) => set("ctaText", e.target.value)} /></F>
              <F label="Enlace del botón"><input className="input" value={draft.ctaLink} onChange={(e) => set("ctaLink", e.target.value)} /></F>
              <F label="Orden"><input type="number" className="input" value={draft.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} /></F>
              <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={draft.active} onChange={(e) => set("active", e.target.checked)} /> Activo</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDraft(null)} className="rounded-full glass px-5 py-2.5">Cancelar</button>
              <button onClick={save} className="rounded-full bg-gradient-brand px-6 py-2.5 font-bold text-white">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
