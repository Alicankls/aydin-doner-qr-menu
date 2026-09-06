import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { getSiteSettings, getDailyMenuProducts } from "@/lib/data/home";
import { DailyMenuPreview } from "@/components/public/daily-menu-preview";
import { RestaurantJsonLd } from "@/components/public/restaurant-json-ld";
import { getStaticImage } from "@/lib/static-image";
import { buildWhatsappLink, buildTelLink, GOOGLE_MAPS_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aydın Döner | Çorlu",
  description:
    "Çorlu'da döner, günlük tabldot yemekler ve ev usulü lezzetler. Günün menüsünü görün, WhatsApp'tan sipariş verin veya paket servis için bizi arayın.",
};

export default async function HomePage() {
  const [settings, dailyMenu] = await Promise.all([
    getSiteSettings(),
    getDailyMenuProducts(),
  ]);

  const heroImage = getStaticImage("images/hero-aydin-doner-lokanta.png");
  const storyImage = getStaticImage("images/story-aile-lokantasi.png");

  const hasWhatsapp = Boolean(settings.whatsapp);
  const hasAddress = Boolean(settings.address);

  return (
    <div>
      <RestaurantJsonLd settings={settings} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-aydin-red-dark">
        {heroImage && (
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[55%_40%]"
            />
            <div className="absolute inset-0 bg-aydin-red-dark/30" />
          </div>
        )}

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-aydin-red" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-warm-white/95 drop-shadow-[0_1px_5px_rgba(0,0,0,0.4)]">
              10 yılı aşkın süredir Yeni Sanayi Sitesi&apos;nde
            </span>
            <span className="h-px w-8 bg-aydin-red" aria-hidden="true" />
          </div>

          {settings.logoUrl && (
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-warm-white p-1 shadow-lg sm:h-24 sm:w-24">
              <Image
                src={settings.logoUrl}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          )}

          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-warm-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-6xl">
            {settings.businessName}
          </h1>

          {settings.tagline && (
            <p className="max-w-xl text-lg leading-relaxed text-warm-cream/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)]">
              {settings.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="inline-flex h-12 items-center rounded-full bg-aydin-red px-7 font-semibold text-white shadow-md transition hover:bg-white hover:text-aydin-red-dark"
            >
              Dijital Menüyü İncele
            </Link>
            {settings.whatsapp && (
              <a
                href={
                  buildWhatsappLink(
                    settings.whatsapp,
                    "Merhaba, sipariş vermek istiyorum."
                  ) ?? "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white px-7 font-semibold text-charcoal transition hover:bg-warm-cream"
              >
                WhatsApp&apos;tan Sipariş Ver
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-warm-cream/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
            {settings.workingHours && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {settings.workingHours}
              </span>
            )}
            {settings.address && (
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition hover:text-white"
              >
                <MapPin className="h-4 w-4" />
                Yol Tarifi Al
              </a>
            )}
            {settings.phone && (
              <a
                href={buildTelLink(settings.phone) ?? "#"}
                className="flex items-center gap-1.5 transition hover:text-white"
              >
                <Phone className="h-4 w-4" />
                {settings.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      <DailyMenuPreview products={dailyMenu} />

      {/* AYDIN DÖNER HİKAYESİ */}
      <section className="relative overflow-hidden bg-aydin-red-dark py-16 md:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="relative order-last aspect-[4/3] overflow-hidden rounded-3xl border border-warm-cream/15 shadow-sm md:order-first">
              {storyImage ? (
                <Image
                  src={storyImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="h-full w-full bg-warm-white" />
              )}
              <div className="absolute inset-0 bg-aydin-red-dark/25" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-warm-cream/80">
                Hikayemiz
              </p>
              <h2 className="mt-1 font-display text-3xl font-extrabold text-warm-white sm:text-4xl">
                10 yılı aşkın süredir aynı sofrada.
              </h2>
              <span className="mt-3 block h-1 w-10 rounded-full bg-aydin-red" aria-hidden="true" />
              <p className="mt-5 leading-relaxed text-warm-cream/85">
                {settings.aboutText ??
                  "10 yılı aşkın süredir Çorlu'da hizmet veren aile işletmemizde, günlük taze yemekler ve el yapımı döner ile misafirlerimizi ağırlıyoruz."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SİPARİŞ / YOL TARİFİ CTA */}
      {(hasWhatsapp || hasAddress) && (
        <section className="bg-aydin-red py-14 text-white md:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">
              Sipariş zamanı
            </p>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Karnınız mı acıktı?
            </h2>
            <p className="max-w-xl text-white/85">
              Hemen WhatsApp&apos;tan sipariş verin ya da yolunuzu bulmanıza
              yardımcı olalım.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              {hasWhatsapp && (
                <a
                  href={
                    buildWhatsappLink(
                      settings.whatsapp,
                      "Merhaba, sipariş vermek istiyorum."
                    ) ?? "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-semibold text-aydin-red-dark shadow-md transition hover:bg-warm-cream"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp&apos;tan Sipariş Ver
                </a>
              )}
              {hasAddress && (
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-7 font-semibold text-white transition hover:bg-white/10"
                >
                  <MapPin className="h-4 w-4" />
                  Yol Tarifi Al
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
