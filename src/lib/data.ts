import { asc, desc, eq } from "drizzle-orm";
import { db, pool } from "@/db";
import { banners, orders, products, settings } from "@/db/schema";
import { defaultSettings } from "./defaults";
import { seedBanners, seedProducts } from "./seed";
import type { Banner, Order, Product, Settings } from "./types";

const g = globalThis as typeof globalThis & { __storeInit?: Promise<void> };

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id serial PRIMARY KEY,
      slug text NOT NULL UNIQUE,
      name text NOT NULL,
      brand text NOT NULL DEFAULT '',
      category text NOT NULL DEFAULT 'Audífonos',
      price numeric(10,2) NOT NULL,
      compare_price numeric(10,2),
      image text NOT NULL DEFAULT '',
      short_description text NOT NULL DEFAULT '',
      description text NOT NULL DEFAULT '',
      features jsonb NOT NULL DEFAULT '[]'::jsonb,
      specs jsonb NOT NULL DEFAULT '[]'::jsonb,
      colors jsonb NOT NULL DEFAULT '[]'::jsonb,
      badge text NOT NULL DEFAULT '',
      rating numeric(2,1) NOT NULL DEFAULT 4.8,
      stock integer NOT NULL DEFAULT 10,
      featured boolean NOT NULL DEFAULT false,
      active boolean NOT NULL DEFAULT true,
      sort_order integer NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS banners (
      id serial PRIMARY KEY,
      title text NOT NULL,
      subtitle text NOT NULL DEFAULT '',
      image text NOT NULL DEFAULT '',
      cta_text text NOT NULL DEFAULT 'Comprar ahora',
      cta_link text NOT NULL DEFAULT '#catalogo',
      active boolean NOT NULL DEFAULT true,
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS orders (
      id serial PRIMARY KEY,
      customer_name text NOT NULL,
      phone text NOT NULL,
      address text NOT NULL DEFAULT '',
      city text NOT NULL DEFAULT '',
      notes text NOT NULL DEFAULT '',
      payment_method text NOT NULL DEFAULT '',
      items jsonb NOT NULL DEFAULT '[]'::jsonb,
      total numeric(10,2) NOT NULL,
      status text NOT NULL DEFAULT 'nuevo',
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS settings (
      id integer PRIMARY KEY,
      data jsonb NOT NULL DEFAULT '{}'::jsonb
    );
    CREATE TABLE IF NOT EXISTS images (
      id serial PRIMARY KEY,
      mime text NOT NULL,
      data text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    );
  `);

  const existing = await db.select({ id: settings.id }).from(settings).where(eq(settings.id, 1));
  if (existing.length === 0) {
    await db.insert(settings).values({ id: 1, data: {} }).onConflictDoNothing();
    const count = await db.select({ id: products.id }).from(products).limit(1);
    if (count.length === 0) {
      await db.insert(products).values(seedProducts).onConflictDoNothing();
      await db.insert(banners).values(seedBanners);
    }
  }
}

export function ensureDb() {
  if (!g.__storeInit) {
    g.__storeInit = init().catch((e) => {
      g.__storeInit = undefined;
      throw e;
    });
  }
  return g.__storeInit;
}

type ProductRow = typeof products.$inferSelect;
export function mapProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    price: Number(r.price),
    comparePrice: r.comparePrice ? Number(r.comparePrice) : null,
    image: r.image,
    shortDescription: r.shortDescription,
    description: r.description,
    features: r.features ?? [],
    specs: r.specs ?? [],
    colors: r.colors ?? [],
    gallery: r.gallery ?? [],
    bgColor: r.bgColor || "#eef2ff",
    badge: r.badge,
    rating: Number(r.rating),
    stock: r.stock,
    featured: r.featured,
    active: r.active,
    sortOrder: r.sortOrder,
  };
}

export async function getSettings(): Promise<Settings> {
  await ensureDb();
  const rows = await db.select().from(settings).where(eq(settings.id, 1));
  return { ...defaultSettings, ...((rows[0]?.data ?? {}) as Partial<Settings>) };
}

export async function saveSettings(data: Partial<Settings>) {
  await ensureDb();
  const current = await getSettings();
  const merged = { ...current, ...data };
  await db
    .insert(settings)
    .values({ id: 1, data: merged })
    .onConflictDoUpdate({ target: settings.id, set: { data: merged } });
  return merged;
}

export async function getProducts(includeInactive = false): Promise<Product[]> {
  await ensureDb();
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id));
  return rows.map(mapProduct).filter((p) => includeInactive || p.active);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureDb();
  const rows = await db.select().from(products).where(eq(products.slug, slug));
  const p = rows[0] ? mapProduct(rows[0]) : null;
  return p && p.active ? p : null;
}

export async function getBanners(includeInactive = false): Promise<Banner[]> {
  await ensureDb();
  const rows = await db.select().from(banners).orderBy(asc(banners.sortOrder), asc(banners.id));
  return rows.filter((b) => includeInactive || b.active);
}

export async function getOrders(): Promise<Order[]> {
  await ensureDb();
  const rows = await db.select().from(orders).orderBy(desc(orders.id));
  return rows.map((o) => ({
    ...o,
    total: Number(o.total),
    createdAt: o.createdAt.toISOString(),
  }));
}
