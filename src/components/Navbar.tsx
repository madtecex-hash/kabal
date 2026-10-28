"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { CartIcon, MenuIcon, WhatsAppIcon, XIcon } from "./Icons";

export default function Navbar() {
  const { count, setOpen, settings } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#catalogo", label: "Catálogo" },
    { href: "/#coleccion", label: "Colección" },
    { href: "/#faq", label: "Ayuda" },
  ];
  const wa = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(settings.whatsappFloatMessage)}`;

  return (
    <>
      {settings.announcementActive && settings.announcement && <div className="bg-gradient-brand text-white text-xs sm:text-sm overflow-hidden border-b border-white/10 select-none"><div className="flex whitespace-nowrap animate-marquee py-2 w-max">{[0,1,2,3].map((i)=><span key={i} className="px-8 font-semibold flex items-center gap-3">{settings.announcement}<span className="text-cyan-200">✦</span></span>)}</div></div>}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-[#09090f]/88 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/30" : "bg-[#09090f]/55 backdrop-blur-md"}`}>
        <nav className="mx-auto max-w-7xl px-4 h-[72px] flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt={settings.storeName} className="h-9 w-auto" />
            ) : <span className="relative grid place-items-center h-10 w-10 rounded-2xl bg-gradient-brand text-white text-lg font-black glow group-hover:-rotate-3 transition-transform">V<span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /></span>}
            <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">{settings.storeName}<span className="block -mt-1 text-[9px] font-bold uppercase tracking-[.2em] text-white/40">Audio · Energía · Accesorios</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] px-2 py-1.5 backdrop-blur-xl">
            {links.map((link) => <Link key={link.href} href={link.href} className="px-3.5 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">{link.label}</Link>)}
          </div>

          <div className="flex items-center gap-2">
            <a href={wa} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors"><WhatsAppIcon className="h-4 w-4" />WhatsApp</a>
            <button onClick={() => setOpen(true)} className="relative inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-white glow hover:scale-105 active:scale-95 transition-all" aria-label="Abrir carrito"><CartIcon className="h-4 w-4" /><span className="hidden sm:inline">Carrito</span><span className="h-5 min-w-5 px-1.5 rounded-full bg-white text-[#26134d] text-[11px] font-black grid place-items-center">{count}</span></button>
            <button className="lg:hidden grid place-items-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white/80" onClick={() => setMenu(!menu)} aria-label="Menú móvil">{menu ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}</button>
          </div>
        </nav>
        {menu && <div className="lg:hidden mx-4 mb-4 rounded-3xl border border-white/10 bg-[#11111b]/95 p-4 shadow-2xl backdrop-blur-xl space-y-1">{links.map((link)=><Link key={link.href} href={link.href} onClick={()=>setMenu(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10">{link.label}</Link>)}<a href={wa} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 py-3 text-sm font-bold text-emerald-300"><WhatsAppIcon className="h-5 w-5"/>Consultar por WhatsApp</a></div>}
      </header>
    </>
  );
}
