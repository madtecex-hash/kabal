import type { ReactNode } from "react";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getSettings } from "@/lib/data";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <CartProvider settings={settings}>
      <div className="store-shell relative min-h-screen overflow-x-clip">
        <div className="blob bg-primary h-96 w-96 -top-20 -left-20" />
        <div className="blob bg-secondary h-80 w-80 top-[40rem] -right-20" />
        <div className="blob bg-accent h-72 w-72 top-[90rem] left-1/3" />
        <Navbar />
        <main className="relative">{children}</main>
        <Footer settings={settings} />
      </div>
      <CartDrawer />
      <CookieBanner />
    </CartProvider>
  );
}
