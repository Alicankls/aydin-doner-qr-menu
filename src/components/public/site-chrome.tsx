"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { useSite } from "@/components/public/site-provider";
import { buildWhatsappLink, buildTelLink, GOOGLE_MAPS_URL, cn } from "@/lib/utils";

function navTabClass(active: boolean) {
  return cn(
    "whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition",
    active
      ? "bg-warm-white font-semibold text-aydin-red-dark hover:bg-white"
      : "border border-white/25 bg-white/10 font-medium text-warm-cream hover:border-white/50 hover:bg-white/20 hover:text-white"
  );
}

export function SiteFooter() {
  const { settings } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          {settings.logoUrl && (
            <div className="relative h-12 w-12 overflow-hidden rounded-lg shadow-sm">
              <Image
                src={settings.logoUrl}
                alt={settings.businessName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          )}
          {settings.tagline && (
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-warm-cream/60">
              {settings.tagline}
            </p>
          )}
        </div>

        <div className="space-y-3 text-sm text-warm-cream/70 md:self-center">
          {settings.address && (
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-aydin-red"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {settings.address}
            </a>
          )}
        </div>

        <div className="space-y-3 text-sm text-warm-cream/70 md:self-center">
          {settings.phone && (
            <a
              href={buildTelLink(settings.phone) ?? "#"}
              className="flex items-center gap-2 hover:text-aydin-red md:justify-end"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {settings.phone}
            </a>
          )}
          {settings.whatsapp && (
            <a
              href={buildWhatsappLink(settings.whatsapp, "Merhaba, sipariş vermek istiyorum.") ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-aydin-red md:justify-end"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              {settings.whatsapp}
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-warm-cream/10 py-4 text-center text-xs text-warm-cream/50">
        © {year} {settings.businessName}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  const { settings } = useSite();
  if (!settings.whatsapp) return null;
  const link = buildWhatsappLink(settings.whatsapp, "Merhaba, sipariş vermek istiyorum.");
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile sipariş ver"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}


export function SiteHeader({ variant }: { variant: "site" | "qr" }) {
  const { settings, categories } = useSite();
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [pathname]);

  const homeHref = variant === "qr" ? "/menu" : "/";

  return (
    <header className="sticky top-0 z-40 bg-aydin-red">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={homeHref} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {settings.logoUrl && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm sm:h-12 sm:w-12">
              <Image
                src={settings.logoUrl}
                alt={settings.businessName}
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
          )}
          <span className="truncate font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
            {settings.businessName}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {settings.phone && (
            <a
              href={buildTelLink(settings.phone) ?? "#"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Telefon ile ara"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          {settings.whatsapp && (
            <a
              href={buildWhatsappLink(settings.whatsapp, "Merhaba, sipariş vermek istiyorum.") ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="WhatsApp ile yaz"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Nav şeridi */}
      {variant === "site" ? (
        <nav className="border-t border-white/15 bg-aydin-red-dark">
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
            <Link
              href="/"
              ref={pathname === "/" ? activeTabRef : undefined}
              className={navTabClass(pathname === "/")}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/gunun-menusu"
              ref={pathname === "/gunun-menusu" ? activeTabRef : undefined}
              className={navTabClass(pathname === "/gunun-menusu")}
            >
              Günün Menüsü
            </Link>
            <Link
              href="/iletisim"
              ref={pathname === "/iletisim" ? activeTabRef : undefined}
              className={navTabClass(pathname === "/iletisim")}
            >
              İletişim
            </Link>
          </div>
        </nav>
      ) : (
        categories.length > 0 && (
          <nav className="border-t border-white/15 bg-aydin-red-dark">
            <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
              <Link
                href="/menu/gunun-menusu"
                ref={pathname === "/menu/gunun-menusu" ? activeTabRef : undefined}
                className={navTabClass(pathname === "/menu/gunun-menusu")}
              >
                Günün Menüsü
              </Link>
              {categories.map((c) => {
                const href = `/menu/kategori/${c.slug}`;
                const active = pathname === href;
                return (
                  <Link
                    key={c.id}
                    href={href}
                    ref={active ? activeTabRef : undefined}
                    className={navTabClass(active)}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        )
      )}
    </header>
  );
}
