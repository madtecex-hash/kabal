import Link from "next/link";
import type { Settings } from "@/lib/types";
import { WhatsAppIcon } from "./Icons";

export default function Footer({ settings }: { settings: Settings }) {
  const wa = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(settings.whatsappFloatMessage)}`;
  const legal = [["Privacidad", "/legal/privacidad"], ["Cookies", "/legal/cookies"], ["Términos", "/legal/terminos"], ["Cambios y devoluciones", "/legal/devoluciones"]];
  return (
    <>
      <a href={wa} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp" className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 shadow-xl shadow-emerald-900/30 hover:-translate-y-0.5 transition-all"><WhatsAppIcon className="h-6 w-6"/><span className="hidden sm:inline text-xs font-extrabold">Pedir por WhatsApp</span></a>
      <footer className="relative mt-24 border-t border-white/10 bg-[#08080d]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-14 grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-black text-white"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white">V</span><span className="text-gradient">{settings.storeName}</span></Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{settings.tagline}. Audífonos, parlantes Bluetooth, carga y accesorios con precios en soles.</p>
            <p className="mt-4 text-[11px] text-white/40">OEM y compatibles identificados como tales. Marcas mencionadas pertenecen a sus titulares.</p>
            {settings.instagram || settings.facebook || settings.tiktok ? <div className="mt-4 flex flex-wrap gap-2">{settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white">Instagram</a>}{settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white">Facebook</a>}{settings.tiktok && <a href={settings.tiktok} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white">TikTok</a>}</div> : null}
          </div>
          <div><h3 className="font-bold text-white">Explora</h3><ul className="mt-3 space-y-2 text-sm text-white/60"><li><Link href="/#catalogo" className="hover:text-cyan-300">Catálogo completo</Link></li><li><Link href="/#coleccion" className="hover:text-cyan-300">Productos destacados</Link></li><li><Link href="/#faq" className="hover:text-cyan-300">Preguntas frecuentes</Link></li></ul></div>
          <div><h3 className="font-bold text-white">Legal y ayuda</h3><ul className="mt-3 space-y-2 text-sm text-white/60">{legal.map(([label,href])=><li key={href}><Link href={href} className="hover:text-cyan-300">{label}</Link></li>)}</ul></div>
          <div><h3 className="font-bold text-white">Atención</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{settings.address}</p><p className="mt-2 text-xs text-white/50">{settings.schedule}</p><a href={wa} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/20"><WhatsAppIcon className="h-5 w-5"/>Contactar por WhatsApp</a><p className="mt-3 text-[11px] text-white/40">Yape, Plin y otros medios: confirma disponibilidad al finalizar.</p></div>
        </div>
        <div className="border-t border-white/10 py-5 px-4"><div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40"><p>© {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.</p><div className="flex items-center gap-3"><span>Precios en Soles (S/)</span><span>·</span><Link href="/admin" className="hover:text-white">Administrar tienda</Link></div></div></div>
      </footer>
    </>
  );
}
