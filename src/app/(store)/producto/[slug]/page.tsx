import Link from "next/link";
import { notFound } from "next/navigation";
import BuyBox from "@/components/BuyBox";
import { CheckIcon, ChevronRightIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug, getProducts, getSettings } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [p, s] = await Promise.all([getProductBySlug(slug), getSettings()]);
  return { title: p ? `${p.name} · ${s.currencySymbol} ${p.price}` : "Producto en Soles", description: p?.shortDescription };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings, all] = await Promise.all([getProductBySlug(slug), getSettings(), getProducts()]);
  if (!product) notFound();
  const related = all.filter((p) => p.id !== product.id).slice(0, 4);
  const views = [product.image, ...product.gallery.filter((g) => g && g !== product.image)];
  const wa = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola, me interesa el producto: ${product.name}. ¿Pueden enviarme más fotos y confirmar disponibilidad?`
  )}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <nav className="mb-7 flex items-center gap-2 overflow-x-auto text-xs text-white/45">
        <Link href="/" className="shrink-0 hover:text-white">Inicio</Link>
        <ChevronRightIcon className="h-3 w-3 shrink-0" />
        <Link href="/#catalogo" className="shrink-0 hover:text-white">Catálogo</Link>
        <ChevronRightIcon className="h-3 w-3 shrink-0" />
        <span className="truncate font-semibold text-white">{product.name}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Galería 3D: lados, caras y detalles del producto */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[.16em] text-cyan-300">
              Galería del producto · {views.length} vista{views.length === 1 ? "" : "s"}
            </span>
            <span className="text-[10px] text-white/40">Mueve el cursor o arrastra</span>
          </div>
          <ProductGallery images={views} name={product.name} bg={product.bgColor} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-white/50">
            <div className="glass rounded-xl p-2.5">🖼️ Vistas y ángulos</div>
            <div className="glass rounded-xl p-2.5">🧊 Elevación 3D al pasar</div>
            <div className="glass rounded-xl p-2.5">🔍 Zoom con un clic</div>
          </div>
        </div>

        {/* Información y compra */}
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[.16em] text-cyan-300">{product.category} · {product.brand}</span>
              {(product.brand.toLowerCase().includes("oem") || product.brand.toLowerCase().includes("compatible")) && (
                <span className="rounded-full bg-amber-300/10 px-3 py-1 text-[10px] font-bold text-amber-200">OEM / compatible · no original</span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">{product.shortDescription}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {product.features.map((f) => (
              <div key={f} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3 py-2.5 text-xs font-semibold text-white/80">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <BuyBox product={product} />

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[.07] p-4 text-xs leading-relaxed text-amber-100/75">
            <b className="text-amber-200">Nota de producto:</b> si es OEM/compatible, la fotografía puede ser referencial y la unidad puede variar en empaque o logotipo. Confirma el modelo, especificaciones y disponibilidad por WhatsApp antes de pagar. La tienda no está afiliada a Apple ni a JBL.
          </div>
        </div>
      </div>

      {/* Ficha completa */}
      <section className="mt-16 grid gap-6 lg:grid-cols-5">
        <div className="glass rounded-3xl p-6 sm:p-8 lg:col-span-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">Detalles</span>
          <h2 className="mt-1 text-2xl font-black text-white">Descripción completa</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/65">{product.description}</p>
          <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/75">
                <CheckIcon className="h-4 w-4 shrink-0 text-emerald-300" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-3xl p-6 sm:p-8 lg:col-span-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">Ficha técnica</span>
          <h2 className="mt-1 text-2xl font-black text-white">Características</h2>
          <div className="mt-4 divide-y divide-white/10">
            {product.specs.map((s) => (
              <div key={s.label} className="grid grid-cols-2 gap-3 py-3 text-xs">
                <span className="text-white/45">{s.label}</span>
                <span className="font-semibold text-white/85">{s.value}</span>
              </div>
            ))}
          </div>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:underline">
            <span>💬</span> Solicitar más fotos por WhatsApp
          </a>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">Más de Voltia</span>
            <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Productos relacionados</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
