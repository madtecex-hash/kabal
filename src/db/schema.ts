import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull().default(""),
  category: text("category").notNull().default("Audífonos"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
  image: text("image").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  bgColor: text("bg_color").notNull().default("#eef2ff"),
  badge: text("badge").notNull().default(""),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("4.8"),
  stock: integer("stock").notNull().default(10),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  image: text("image").notNull().default(""),
  ctaText: text("cta_text").notNull().default("Comprar ahora"),
  ctaLink: text("cta_link").notNull().default("#catalogo"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull().default(""),
  city: text("city").notNull().default(""),
  notes: text("notes").notNull().default(""),
  paymentMethod: text("payment_method").notNull().default(""),
  items: jsonb("items")
    .$type<{ id: number; name: string; price: number; qty: number; color?: string }[]>()
    .notNull()
    .default([]),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("nuevo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: integer("id").primaryKey(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  mime: text("mime").notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
