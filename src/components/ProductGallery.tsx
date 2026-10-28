"use client";

import { useCallback, useRef, useState } from "react";

type Props = { images: string[]; name: string; bg: string };

/**
 * Visor 3D de producto: inclina el escenario con el puntero, permite arrastrar
 * para recorrer los ángulos, ampliar la imagen y seleccionar vistas en miniatura.
 */
export default function ProductGallery({ images, name, bg }: Props) {
  const views = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(false);
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startIndex = useRef(0);

  const go = useCallback(
    (direction: number) => {
      if (views.length < 2) return;
      setIndex((i) => (i + direction + views.length) % views.length);
    },
    [views.length]
  );

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (dragging) {
      const delta = Math.round((e.clientX - startX.current) / 72);
      const next = (((startIndex.current - delta) % views.length) + views.length) % views.length;
      setIndex(next);
      return;
    }
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 8, y: px * 12 });
  };

  const endDrag = () => setDragging(false);

  if (!views.length) return null;

  return (
    <div>
      <div
        ref={stage}
        tabIndex={0}
        role="group"
        aria-label={`Galería 3D de ${name}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        }}
        onPointerMove={handleMove}
        onPointerLeave={() => { if (!dragging) setTilt({ x: 0, y: 0 }); }}
        onPointerDown={(e) => {
          if (views.length < 2) return;
          startX.current = e.clientX;
          startIndex.current = index;
          setDragging(true);
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="gallery-stage relative aspect-square w-full cursor-grab select-none rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 active:cursor-grabbing touch-pan-y"
        style={{ touchAction: "pan-y" }}
      >
        <div
          className={`gallery-tilt ${dragging ? "" : "animate"} product-plate h-full w-full rounded-[2rem] border border-white/15 shadow-2xl shadow-black/40`}
          style={{ "--plate": bg, transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${zoom ? 1.12 : 1})` } as React.CSSProperties}
        >
          {views.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src}
              src={src}
              alt={`${name} — vista ${i + 1} de ${views.length}`}
              draggable={false}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-contain p-5 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>

        {/* Etiqueta de vista y atajos (fuera de la capa inclinada) */}
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">
            {views.length > 1 ? `Vista ${index + 1} / ${views.length}` : "Vista única"}
          </span>
          <span className="rounded-full border border-cyan-300/25 bg-[#0a0a13]/75 px-3 py-1.5 text-[10px] font-extrabold text-cyan-200 backdrop-blur">
            🧊 Vista 3D · mueve el cursor
          </span>
        </div>

        {views.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Vista anterior"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:bg-[#1749b8] hover:border-[#1749b8]"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Vista siguiente"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:bg-[#1749b8] hover:border-[#1749b8]"
            >
              ›
            </button>
          </>
        )}

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setZoom((z) => !z)}
          className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:bg-[#1749b8]"
          aria-label={zoom ? "Restaurar tamaño" : "Ampliar imagen"}
        >
          {zoom ? "–" : "+"}
        </button>
      </div>

      {/* Miniaturas / selector de ángulos */}
      {views.length > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 gap-2.5 overflow-x-auto pb-1">
            {views.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver vista ${i + 1} de ${name}`}
                className={`product-plate h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  i === index ? "border-cyan-300 scale-105 shadow-lg shadow-cyan-500/25" : "border-white/15 opacity-70 hover:opacity-100"
                }`}
                style={{ "--plate": bg } as React.CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-contain p-1.5" draggable={false} />
              </button>
            ))}
          </div>
          <p className="hidden shrink-0 text-[10px] leading-tight text-white/45 sm:block">
            Arrastra la imagen<br />o usa ← →
          </p>
        </div>
      )}
    </div>
  );
}
