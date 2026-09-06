import Link from "next/link";
import { ChevronRight, Soup } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { getActiveCategoriesWithActiveProducts } from "@/lib/data/categories";
import { getDailyMenuProducts } from "@/lib/data/products";
import { MenuHeroBanner } from "@/components/public/menu-hero-banner";
import { DailyMenuPreview } from "@/components/public/daily-menu-preview";
import { ProductCard } from "@/components/public/product-card";
import { EmptyState } from "@/components/public/empty-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menü | Aydın Döner",
  description:
    "Aydın Döner dijital menüsü: günün menüsü ve tüm ürün kategorilerimiz.",
};

export default async function MenuHomePage() {
  const [settings, categories, dailyMenu] = await Promise.all([
    getSiteSettings(),
    getActiveCategoriesWithActiveProducts(),
    getDailyMenuProducts(),
  ]);

  const categoriesWithProducts = categories.filter(
    (category) => category.products.length > 0
  );

  return (
    <div>
      <MenuHeroBanner businessName={settings.businessName} logoUrl={settings.logoUrl} />
      <DailyMenuPreview products={dailyMenu} />

      <section className="bg-warm-white pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">
              Menü
            </p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
              Kategoriler
            </h2>
            <span className="mt-3 block h-1 w-10 rounded-full bg-aydin-red" aria-hidden="true" />
          </div>

          {categoriesWithProducts.length === 0 ? (
            <EmptyState
              icon={<Soup className="h-10 w-10" />}
              title="Menümüz hazırlanıyor."
              description="Çok yakında burada olacak, takipte kalın."
            />
          ) : (
            <div className="space-y-12">
              {categoriesWithProducts.map((category) => (
                <div key={category.id}>
                  <div className="mb-5 flex items-center justify-between gap-4 rounded-xl bg-aydin-red-dark px-5 py-3">
                    <h3 className="font-display text-lg font-bold text-warm-white sm:text-xl">
                      {category.name}
                    </h3>
                    <Link
                      href={`/menu/kategori/${category.slug}`}
                      className="flex shrink-0 items-center gap-1 text-sm font-semibold text-warm-cream transition hover:text-white"
                    >
                      Kategoriyi Gör
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
