"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setLoading(false);
    if (res.ok) window.location.reload();
    else setErr("Contraseña incorrecta");
  };
  return (
    <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden">
      <div className="blob bg-primary h-96 w-96 top-0 left-0" />
      <div className="blob bg-accent h-80 w-80 bottom-0 right-0" />
      <form onSubmit={submit} className="relative glass rounded-3xl p-8 w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center text-2xl glow">🔐</div>
          <h1 className="mt-4 text-2xl font-black">Panel de administración</h1>
          <p className="text-sm text-fg/60">Ingresa tu contraseña para continuar</p>
        </div>
        <input type="password" className="input" placeholder="Contraseña" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button disabled={loading} className="w-full rounded-full bg-gradient-brand py-3 font-bold text-white disabled:opacity-60">{loading ? "Entrando..." : "Entrar"}</button>
        <p className="text-xs text-center text-fg/40">Contraseña por defecto: <code>admin123</code> (cámbiala con la variable ADMIN_PASSWORD)</p>
        <a href="/" className="block text-center text-sm text-fg/60 hover:text-fg">← Volver a la tienda</a>
      </form>
    </div>
  );
}
