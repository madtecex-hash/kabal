"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Settings } from "@/lib/types";

export type CartItem = { id: number; name: string; price: number; image: string; qty: number; color?: string };

type Ctx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  update: (id: number, color: string | undefined, qty: number) => void;
  remove: (id: number, color: string | undefined) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  settings: Settings;
  money: (n: number) => string;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children, settings }: { children: ReactNode; settings: Settings }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("voltiaperu-cart-v2");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("voltiaperu-cart-v2", JSON.stringify(items));
  }, [items, loaded]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id && p.color === item.color);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...prev, { ...item, qty }];
    });
    setOpen(true);
  }, []);

  const update = useCallback((id: number, color: string | undefined, qty: number) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id && p.color === color ? { ...p, qty: Math.max(1, qty) } : p))
    );
  }, []);

  const remove = useCallback((id: number, color: string | undefined) => {
    setItems((prev) => prev.filter((p) => !(p.id === id && p.color === color)));
  }, []);

  const value = useMemo<Ctx>(() => {
    const count = items.reduce((a, i) => a + i.qty, 0);
    const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);
    return {
      items,
      open,
      setOpen,
      add,
      update,
      remove,
      clear: () => setItems([]),
      count,
      subtotal,
      settings,
      money: (n: number) => `${settings.currencySymbol} ${n.toFixed(2)}`,
    };
  }, [items, open, add, update, remove, settings]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
