function str(v: unknown, d = "") {
  return typeof v === "string" ? v : d;
}
function arr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(/\n|,/).map((s) => s.trim()).filter(Boolean);
  return [];
}
export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export function parseProduct(b: Record<string, unknown>) {
  const name = str(b.name).trim();
  const specs = Array.isArray(b.specs)
    ? (b.specs as { label?: unknown; value?: unknown }[])
        .map((s) => ({ label: str(s.label).trim(), value: str(s.value).trim() }))
        .filter((s) => s.label)
    : [];
  const cp = Number(b.comparePrice);
  return {
    name,
    slug: slugify(str(b.slug) || name) || "producto-" + Date.now(),
    brand: str(b.brand),
    category: str(b.category, "Inalámbricos") || "Inalámbricos",
    price: String(Number(b.price) || 0),
    comparePrice: cp > 0 ? String(cp) : null,
    image: str(b.image),
    shortDescription: str(b.shortDescription),
    description: str(b.description),
    features: arr(b.features),
    specs,
    colors: arr(b.colors),
    gallery: arr(b.gallery),
    bgColor: /^#[0-9a-fA-F]{6}$/.test(str(b.bgColor)) ? str(b.bgColor) : "#eef2ff",
    badge: str(b.badge),
    rating: String(Math.min(5, Math.max(0, Number(b.rating) || 4.8))),
    stock: Math.max(0, Math.floor(Number(b.stock) || 0)),
    featured: Boolean(b.featured),
    active: b.active === undefined ? true : Boolean(b.active),
    sortOrder: Math.floor(Number(b.sortOrder) || 0),
  };
}
export function parseBanner(b: Record<string, unknown>) {
  return {
    title: str(b.title),
    subtitle: str(b.subtitle),
    image: str(b.image),
    ctaText: str(b.ctaText, "Comprar ahora"),
    ctaLink: str(b.ctaLink, "#catalogo"),
    active: b.active === undefined ? true : Boolean(b.active),
    sortOrder: Math.floor(Number(b.sortOrder) || 0),
  };
}
