import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { getSettings } from "@/lib/data";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `${s.storeName} · ${s.tagline}`,
    description: s.heroSubtitle,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const s = await getSettings();
  const style = {
    "--primary": s.colorPrimary,
    "--secondary": s.colorSecondary,
    "--accent": s.colorAccent,
    "--bg": s.colorBackground,
    "--surface": s.colorSurface,
    "--fg": s.colorText,
  } as CSSProperties;
  return (
    <html lang="es" style={style}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
