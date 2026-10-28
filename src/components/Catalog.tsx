"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { SearchIcon, XIcon } from "./Icons";

type Tier="all"|"under100"|"100to250"|"over250";
export default function Catalog({products}:{products:Product[]}){
  const [category,setCategory]=useState("Todos");const [query,setQuery]=useState("");const [tier,setTier]=useState<Tier>("all");const [sort,setSort]=useState("destacados");
  const categories=useMemo(()=>["Todos",...Array.from(new Set(products.map(p=>p.category)))],[products]);
  const filtered=useMemo(()=>{
    let list=products.filter(p=>{
      const text=[p.name,p.brand,p.shortDescription,...p.features].join(" ").toLowerCase();
      const categoryOk=category==="Todos"||p.category===category;const queryOk=text.includes(query.toLowerCase());
      const priceOk=tier==="all"||(tier==="under100"?p.price<100:tier==="100to250"?p.price>=100&&p.price<=250:p.price>250);
      return categoryOk&&queryOk&&priceOk;
    });
    if(sort==="menor")list=[...list].sort((a,b)=>a.price-b.price);if(sort==="mayor")list=[...list].sort((a,b)=>b.price-a.price);if(sort==="destacados")list=[...list].sort((a,b)=>Number(b.featured)-Number(a.featured)||a.sortOrder-b.sortOrder);return list;
  },[products,category,query,tier,sort]);
  const reset=()=>{setCategory("Todos");setQuery("");setTier("all")};
  const tiers:{key:Tier;label:string}[]=[{key:"all",label:"Todos los precios"},{key:"under100",label:"Menos de S/ 100"},{key:"100to250",label:"S/ 100–250"},{key:"over250",label:"Más de S/ 250"}];
  return <div>
    <div className="glass mb-7 space-y-4 rounded-3xl p-4 sm:p-5">
      <div className="flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${category===c?"bg-gradient-brand text-white glow":"border border-white/10 bg-white/[.04] text-white/65 hover:bg-white/10 hover:text-white"}`}>{c}</button>)}</div>
      <div className="grid gap-3 border-t border-white/10 pt-4 lg:grid-cols-12">
        <div className="relative lg:col-span-5"><SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"/><input className="input !pl-10 !pr-10 !py-2.5 text-sm" placeholder="Buscar audífonos, parlantes, cargadores…" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button onClick={()=>setQuery("")} aria-label="Borrar búsqueda" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"><XIcon className="h-4 w-4"/></button>}</div>
        <div className="flex items-center gap-1 overflow-x-auto lg:col-span-5">{tiers.map(t=><button key={t.key} onClick={()=>setTier(t.key)} className={`whitespace-nowrap rounded-xl px-3 py-2 text-[10px] font-bold transition-colors ${tier===t.key?"border border-cyan-400/30 bg-cyan-400/10 text-cyan-200":"text-white/50 hover:bg-white/5 hover:text-white"}`}>{t.label}</button>)}</div>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="input !py-2.5 text-sm lg:col-span-2"><option value="destacados">Destacados</option><option value="menor">Precio: menor</option><option value="mayor">Precio: mayor</option></select>
      </div>
      <div className="flex items-center justify-between text-xs text-white/50"><span><b className="text-white">{filtered.length}</b> productos · precios en Soles</span>{(query||category!=="Todos"||tier!=="all")&&<button onClick={reset} className="font-semibold text-cyan-300 hover:underline">Limpiar filtros</button>}</div>
    </div>
    {filtered.length===0?<div className="glass rounded-3xl p-12 text-center"><p className="text-4xl">⌕</p><h3 className="mt-3 font-bold text-white">No encontramos productos</h3><p className="mt-1 text-sm text-white/50">Prueba otra búsqueda o limpia los filtros.</p><button onClick={reset} className="mt-5 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white">Ver todo el catálogo</button></div>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div>}
  </div>;
}
