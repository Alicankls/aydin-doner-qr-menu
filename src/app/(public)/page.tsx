import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, Flame, ChevronRight, Soup } from "lucide-react";
import {
  getSiteSettings,
  getActiveCategoriesWithActiveProducts,
  getDailyMenuProducts,
} from "@/lib/data/home";
import { ProductCard } from "@/components/public/product-card";
import { EmptyState } from "@/components/public/empty-state";
import { RestaurantJsonLd } from "@/components/public/restaurant-json-ld";
import { getStaticImage } from "@/lib/static-image";
import {
  buildWhatsappLink,
  buildTelLink,
  buildMapsLink,
  formatPrice,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aydın Döner | Çorlu",
  description:
    "Çorlu'da döner, günlük tabldot yemekler ve ev usulü lezzetler. Günün menüsünü görün, WhatsApp'tan sipariş verin veya paket servis için bizi arayın.",
};

export default async function HomePage() {
  const [settings, categories, dailyMenu] = await Promise.all([
    getSiteSettings(),
    getActiveCategoriesWithActiveProducts(),
    getDailyMenuProducts(),
  ]);

  const heroBg = getStaticImage("images/hero-bg.png");
  const accentDailyMenu = getStaticImage("images/accent-daily-menu.png");
  const accentFullMenu = getStaticImage("images/accent-full-menu.png");

  return (
    <div>
      <RestaurantJsonLd settings={settings} />
      {/* HERO */}
      <section className="relative overflow-hidden bg-warm-cream">
        {heroBg && (
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={heroBg}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-warm-cream/50 via-warm-cream/75 to-warm-cream" />
          </div>
        )}
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-aydin-red/20 bg-white px-4 py-1.5 text-xs font-semibold text-aydin-red-dark">
            <Flame className="h-3.5 w-3.5" />
            10 yılı aşkın süredir Çorlu&apos;da
          </span>

          {settings.logoUrl && (
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-lg sm:h-24 sm:w-24">
              <Image src={settings.logoUrl} alt="" fill sizes="96px" className="object-cover" />
            </div>
          )}
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-charcoal sm:text-6xl">
            {settings.businessName}
          </h1>

          {settings.tagline && (
            <p className="max-w-xl text-lg leading-relaxed text-secondary-text">{settings.tagline}</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#gunun-menusu"
              className="inline-flex h-12 items-center rounded-full bg-aydin-red px-7 font-semibold text-white shadow-md transition hover:bg-aydin-red-dark"
            >
              Günün Menüsünü Gör
            </a>
            {settings.whatsapp && (
              <a
                href={buildWhatsappLink(settings.whatsapp, "Merhaba, sipariş vermek istiyorum.") ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full border border-charcoal/15 bg-white px-7 font-semibold text-charcoal transition hover:border-aydin-red hover:text-aydin-red"
              >
                WhatsApp&apos;tan Sipariş Ver
              </a>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-secondary-text">
            {settings.workingHours && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {settings.workingHours}
              </span>
            )}
            {settings.address && (
              <a
                href={buildMapsLink(settings.address) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-aydin-red"
              >
                <MapPin className="h-4 w-4" />
                Yol Tarifi Al
              </a>
            )}
            {settings.phone && (
              <a
                href={buildTelLink(settings.phone) ?? "#"}
                className="flex items-center gap-1.5 hover:text-aydin-red"
              >
                <Phone className="h-4 w-4" />
                {settings.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* GÜNÜN MENÜSÜ */}
      <section id="gunun-menusu" className="scroll-mt-32 py-14">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {accentDailyMenu && (
            <div
              className="pointer-events-none absolute -left-36 top-1/2 hidden w-32 -translate-y-1/2 select-none 2xl:block"
              aria-hidden="true"
            >
              <Image
                src={accentDailyMenu}
                alt=""
                width={200}
                height={250}
                className="h-auto w-full -rotate-6 drop-shadow-xl"
              />
            </div>
          )}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">Bugün ne var?</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-charcoal">Günün Menüsü</h2>
          </div>

          {dailyMenu.length === 0 ? (
            <EmptyState
              title="Bugünün menüsü henüz hazırlanmadı."
              description="Aşağıdaki genel menümüzden dilediğinizi inceleyebilirsiniz."
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border-soft bg-warm-cream/70 shadow-sm">
              <ul className="divide-y divide-border-soft/80">
                {dailyMenu.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/urun/${product.slug}`}
                      className={`flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/60 sm:px-7 ${
                        product.isSoldOut ? "opacity-60" : ""
                      }`}
                    >
                      <div>
                        <p className="font-display text-base font-bold text-charcoal sm:text-lg">
                          {product.name}
                        </p>
                        {product.shortDescription && (
                          <p className="mt-0.5 text-sm text-secondary-text">{product.shortDescription}</p>
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
          )}
        </div>
      </section>

      {/* TÜM MENÜ */}
      <section id="menu" className="scroll-mt-32 pb-16">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {accentFullMenu && (
            <div
              className="pointer-events-none absolute -right-36 top-10 hidden w-32 select-none 2xl:block"
              aria-hidden="true"
            >
              <Image
                src={accentFullMenu}
                alt=""
                width={200}
                height={250}
                className="h-auto w-full rotate-6 drop-shadow-xl"
              />
            </div>
          )}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">Menü</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-charcoal">Tüm Ürünlerimiz</h2>
          </div>

          {categories.length === 0 ? (
            <EmptyState
              icon={<Soup className="h-10 w-10" />}
              title="Menümüz hazırlanıyor."
              description="Çok yakında burada olacak, takipte kalın."
            />
          ) : (
            <div className="space-y-12">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold text-charcoal">{category.name}</h3>
                    <Link
                      href={`/kategori/${category.slug}`}
                      className="flex items-center gap-1 text-sm font-medium text-aydin-red hover:text-aydin-red-dark"
                    >
                      Kategoriyi Gör
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  {category.products.length === 0 ? (
                    <Link href={`/kategori/${category.slug}`} className="block">
                      <EmptyState
                        icon={<Soup className="h-10 w-10" />}
                        title={`${category.name} kategorisi hazırlanıyor.`}
                        description="Ürünler eklendiğinde burada görünecek — kategoriyi görüntülemek için tıklayın."
                      />
                    </Link>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {category.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
