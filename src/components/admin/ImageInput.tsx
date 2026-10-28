"use client";

import { useRef, useState } from "react";

export default function ImageInput({ value, onChange, label = "Imagen" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const upload = async (file: File) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (res.ok) onChange(data.url);
    else alert(data.error || "Error al subir");
  };
  return (
    <div>
      <label className="text-xs text-fg/60">{label}</label>
      <div className="mt-1 flex gap-3 items-center">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-fg/5 border border-fg/10 overflow-hidden grid place-items-center text-fg/30 text-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : "Sin img"}
        </div>
        <div className="flex-1 space-y-2">
          <input className="input text-sm" placeholder="URL de la imagen o súbela" value={value} onChange={(e) => onChange(e.target.value)} />
          <button type="button" onClick={() => ref.current?.click()} className="rounded-full glass px-4 py-1.5 text-xs font-semibold hover:bg-fg/10">
            {loading ? "Subiendo..." : "📤 Subir imagen"}
          </button>
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </div>
      </div>
    </div>
  );
}
