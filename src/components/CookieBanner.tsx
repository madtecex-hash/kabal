"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!document.cookie.includes("cookie_consent=")) setShow(true); }, []);
  const choose = (value: "all" | "necessary") => { document.cookie = `cookie_consent=${value}; Path=/; Max-Age=${60*60*24*365}; SameSite=Lax`; setShow(false); };
  if (!show) return null;
  return <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 rounded-2xl glass p-5 shadow-2xl"><p className="font-extrabold text-white">🍪 Preferencias de cookies</p><p className="mt-1 text-sm leading-relaxed text-white/70">Usamos una cookie para recordar esta elección y almacenamiento local para guardar tu carrito. No activamos cookies analíticas. Consulta la <Link href="/legal/cookies" className="font-semibold text-cyan-300 underline">Política de Cookies</Link>.</p><div className="mt-4 flex gap-2"><button onClick={()=>choose("all")} className="flex-1 rounded-xl bg-gradient-brand py-2.5 text-xs font-bold text-white">Aceptar</button><button onClick={()=>choose("necessary")} className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10">Solo necesarias</button></div></div>;
}
