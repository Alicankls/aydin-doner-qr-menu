import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Flame, AlertTriangle, MessageCircle, Soup, ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";
import { ProductCard } from "@/components/public/product-card";
import { buildWhatsappLink, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product || !product.isActive) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  const whatsappOrder = product.isSoldOut
    ? null
    : buildWhatsappLink(
        settings.whatsapp,
        `Merhaba, ${product.name} sipariş vermek istiyorum.`
      );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-secondary-text transition hover:text-aydin-red"
      >
        <ArrowLeft className="h-4 w-4" />
        Menüye Dön
      </Link>

      {/* ÜST BLOK */}
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        {/* Sol: büyük görsel */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border-soft bg-warm-cream shadow-sm">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover ${product.isSoldOut ? "opacity-60" : ""}`}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-border-soft">
              <Soup className="h-16 w-16" />
            </span>
          )}

          {product.isSoldOut && (
            <div className="absolute left-5 top-5 rounded-full bg-sold-out px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
              Tükendi
            </div>
          )}
        </div>

        {/* Sağ: bilgiler + aksiyonlar */}
        <div className="order-first flex flex-col gap-5 md:order-none">
          <div>
            <Link
              href={`/kategori/${product.category.slug}`}
              className="text-xs font-bold uppercase tracking-widest text-aydin-red transition hover:text-aydin-red-dark"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
              {product.name}
            </h1>
            {product.code && (
              <p className="mt-1.5 text-sm text-secondary-text">Kod: {product.code}</p>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-lg leading-relaxed text-secondary-text">{product.shortDescription}</p>
          )}

          <p className="font-display text-4xl font-extrabold text-aydin-red-dark">
            {formatPrice(product.price)}
          </p>

          {whatsappOrder ? (
            <a
              href={whatsappOrder}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 text-base font-semibold text-white shadow-md transition hover:brightness-105"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp ile Sipariş Ver
            </a>
          ) : (
            <button
              disabled
              className="inline-flex h-14 cursor-not-allowed items-center justify-center rounded-full bg-sold-out/20 px-8 text-base font-semibold text-sold-out"
            >
              Bu ürün bugün tükendi
            </button>
          )}
        </div>
      </div>

      {/* ALT BLOK - detaylar */}
      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
        {product.longDescription && (
          <section className="rounded-2xl border border-border-soft bg-warm-cream/60 p-6">
            <h2 className="font-display text-lg font-bold text-charcoal">Detaylı Açıklama</h2>
            <p className="mt-3 leading-relaxed text-secondary-text">{product.longDescription}</p>
          </section>
        )}

        {(product.calories != null || product.allergenInfo) && (
          <section className="rounded-2xl border border-border-soft bg-warm-cream/60 p-6">
            <h2 className="font-display text-lg font-bold text-charcoal">Besin &amp; Alerjen</h2>
            <div className="mt-3 space-y-3">
              {product.calories != null && (
                <p className="flex items-start gap-2.5 text-sm text-secondary-text">
                  <Flame className="mt-0.5 h-4 w-4 shrink-0 text-aydin-red" />
                  <span>
                    <strong className="text-charcoal">{product.calories} kcal</strong> — yaklaşık kalori
                    değeri
                  </span>
                </p>
              )}
              {product.allergenInfo && (
                <p className="flex items-start gap-2.5 text-sm text-secondary-text">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-aydin-red" />
                  <span>{product.allergenInfo}</span>
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section className="mt-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-charcoal">Benzer Ürünler</h2>
            <Link
              href={`/kategori/${product.category.slug}`}
              className="flex items-center gap-1 text-sm font-medium text-aydin-red hover:text-aydin-red-dark"
            >
              Tümünü Gör
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
