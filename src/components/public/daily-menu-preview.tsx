import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { DailyMenuTabldotHighlight } from "@/components/public/daily-menu-tabldot-highlight";
import { formatPrice } from "@/lib/utils";
import { withDailyMenuAutoSoldOut } from "@/lib/daily-menu-status";
import type { getDailyMenuProducts } from "@/lib/data/products";

type Product = Awaited<ReturnType<typeof getDailyMenuProducts>>[number];

export function DailyMenuPreview({ products }: { products: Product[] }) {
  const displayProducts = withDailyMenuAutoSoldOut(products);
  const groups = new Map<string, { name: string; products: Product[] }>();
  for (const product of displayProducts) {
    const key = product.category.id;
    if (!groups.has(key)) {
      groups.set(key, { name: product.category.name, products: [] });
    }
    groups.get(key)!.products.push(product);
  }

  return (
    <section id="gunun-menusu-onizleme" className="scroll-mt-32 bg-warm-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">
            Bugün ne var?
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-charcoal">
            Günün Menüsü
          </h2>
          <span className="mt-3 block h-1 w-10 rounded-full bg-aydin-red" aria-hidden="true" />
        </div>

        <DailyMenuTabldotHighlight />

        {groups.size === 0 ? (
          <EmptyState
            title="Bugünün menüsü henüz hazırlanmadı."
            description="Aşağıdaki genel menümüzden dilediğinizi inceleyebilirsiniz."
          />
        ) : (
          <>
            <div className="space-y-10">
              {Array.from(groups.values()).map((group) => (
                <div key={group.name}>
                  <h3 className="mb-4 rounded-xl bg-aydin-red-dark px-5 py-3 font-display text-lg font-bold text-warm-white sm:text-xl">
                    {group.name}
                  </h3>
                  <div className="overflow-hidden rounded-2xl border border-aydin-red/15 bg-warm-cream/70 shadow-sm">
                    <ul className="divide-y divide-border-soft/80">
                      {group.products.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/menu/urun/${product.slug}`}
                            className={`flex items-center justify-between gap-4 border-l-2 border-transparent px-5 py-4 transition hover:border-l-aydin-red hover:bg-white/60 sm:px-7 ${
                              product.isSoldOut ? "opacity-60" : ""
                            }`}
                          >
                            <div>
                              <p className="font-display text-base font-bold text-charcoal sm:text-lg">
                                {product.name}
                              </p>
                              {product.shortDescription && (
                                <p className="mt-0.5 text-sm text-secondary-text">
                                  {product.shortDescription}
                                </p>
                              )}
                              {product.calories != null && (
                                <p className="mt-0.5 text-xs font-medium text-secondary-text">
                                  {product.calories} kcal
                                </p>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              {product.isSoldOut && (
                                <span className="rounded-full bg-sold-out px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                                  Tükendi
                                </span>
                              )}
                              <span className="text-lg font-extrabold text-aydin-red-dark">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
