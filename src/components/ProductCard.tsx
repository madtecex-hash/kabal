"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import ProductPlate from "./ProductPlate";
import { CartIcon, WhatsAppIcon } from "./Icons";

export default function ProductCard({ product }: { product: Product }) {
  const { add, money, settings } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`¡Hola! Quiero consultar por *${product.name}* a ${money(product.price)}${selectedColor ? `, color ${selectedColor}` : ""}. ¿Me confirman disponibilidad y detalles OEM/compatibilidad?`)}`;

  return (
    <article className="glass-card group relative flex flex-col rounded-3xl p-3.5 sm:p-4">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-[1.1/1] overflow-hidden rounded-2xl border border-white/10">
        <ProductPlate
          src={product.image}
          alt={product.name}
          bg={product.bgColor}
          className="h-full w-full"
          imgClassName="pop h-full w-full object-contain p-4"
        />
        {product.badge && <span className="absolute top-3 left-3 z-10 rounded-full border border-black/20 bg-black/70 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">{product.badge}</span>}
        {(product.brand.toLowerCase().includes("oem") || product.brand.toLowerCase().includes("compatible")) && <span className="absolute bottom-3 left-3 z-10 rounded-full bg-amber-300 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-amber-950">OEM / compatible</span>}
        {product.gallery.length > 0 && <span className="absolute right-3 top-3 z-10 rounded-full border border-black/20 bg-black/70 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur">🖼 {product.gallery.length + 1} fotos</span>}
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-cyan-300"><span>{product.category}</span><span className="truncate text-right text-white/45 normal-case tracking-normal">{product.brand}</span></div>
        <Link href={`/producto/${product.slug}`} className="mt-1.5 min-h-[2.7rem] text-base font-extrabold leading-snug text-white transition-colors hover:text-cyan-200 sm:text-lg line-clamp-2">{product.name}</Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/60">{product.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{product.features.slice(0,2).map((feature)=><span key={feature} className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[10px] text-white/70">{feature}</span>)}</div>
        {product.colors.length > 1 && <div className="mt-3 flex items-center gap-1.5"><span className="mr-1 text-[10px] text-white/45">Color:</span>{product.colors.map((color)=><button type="button" key={color} onClick={()=>setSelectedColor(color)} className={`rounded-lg border px-2 py-1 text-[10px] transition-colors ${selectedColor===color?"border-cyan-300 bg-cyan-400/10 text-cyan-200":"border-white/10 text-white/60 hover:border-white/30"}`}>{color}</button>)}</div>}

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-end justify-between gap-2">
            <div><p className="text-2xl font-black tracking-tight text-white">{money(product.price)}</p></div>
            <span className="pb-1 text-[9px] font-semibold text-white/40">Precio en soles</span>
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <button disabled={product.stock<=0} onClick={()=>add({id:product.id,name:product.name,price:product.price,image:product.image,color:selectedColor||undefined})} className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-brand px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40"><CartIcon className="h-4 w-4"/>Añadir al carrito</button>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Consultar ${product.name} por WhatsApp`} className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 text-emerald-300 transition-colors hover:bg-emerald-500/20"><WhatsAppIcon className="h-5 w-5"/></a>
          </div>
        </div>
      </div>
    </article>
  );
}
