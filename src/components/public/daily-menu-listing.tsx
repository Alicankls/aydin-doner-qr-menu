import Image from "next/image";
import { Soup } from "lucide-react";
import { getDailyMenuProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/public/product-card";
import { EmptyState } from "@/components/public/empty-state";
import { DailyMenuTabldotHighlight } from "@/components/public/daily-menu-tabldot-highlight";
import { BreadcrumbJsonLd } from "@/components/public/breadcrumb-json-ld";
import { getSiteUrl } from "@/lib/site-url";
import { getStaticImage } from "@/lib/static-image";
import { withDailyMenuAutoSoldOut } from "@/lib/daily-menu-status";

export async function DailyMenuListing({
  homeHref,
  homeLabel,
}: {
  homeHref: string;
  homeLabel: string;
}) {
  const dailyMenu = await getDailyMenuProducts();
  const displayMenu = withDailyMenuAutoSoldOut(dailyMenu);
  const bannerImage = getStaticImage("images/category-gunun-menusu-yeni.png");
  const selfHref = homeHref === "/" ? "/gunun-menusu" : `${homeHref}/gunun-menusu`;

  const groups = new Map<
    string,
    { name: string; products: typeof dailyMenu }
  >();
  for (const product of displayMenu) {
    const key = product.category.id;
    if (!groups.has(key)) {
      groups.set(key, { name: product.category.name, products: [] });
    }
    groups.get(key)!.products.push(product);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: homeLabel, path: getSiteUrl(homeHref) },
          { name: "Günün Menüsü", path: getSiteUrl(selfHref) },
        ]}
      />

      {bannerImage && (
        <div className="relative mb-6 aspect-[3/1] w-full overflow-hidden rounded-3xl">
          <Image
            src={bannerImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">
        Bugün ne var?
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
        Günün Menüsü
      </h1>
      <p className="mt-3 max-w-2xl text-secondary-text">
        Her gün taze hazırladığımız tabldot yemeklerimiz. Aşağıdaki seçim
        güne göre değişebilir.
      </p>

      <div className="mt-8">
        <DailyMenuTabldotHighlight />
      </div>

      {dailyMenu.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={<Soup className="h-10 w-10" />}
          title="Bugünün menüsü henüz hazırlanmadı."
          description="Aşağıdaki genel menümüzden dilediğinizi inceleyebilirsiniz."
        />
      ) : (
        <div className="mt-10 space-y-12">
          {Array.from(groups.values()).map((group) => (
            <div key={group.name}>
              <h2 className="mb-5 rounded-xl bg-aydin-red-dark px-5 py-3 font-display text-lg font-bold text-warm-white sm:text-xl">
                {group.name}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
