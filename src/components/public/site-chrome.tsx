"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useSite } from "@/components/public/site-provider";
import { buildWhatsappLink, buildTelLink, buildMapsLink, cn } from "@/lib/utils";

function navTabClass(active: boolean) {
  return cn(
    "whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition",
    active
      ? "bg-aydin-red font-semibold text-white hover:bg-aydin-red-dark"
      : "border border-border-soft font-medium text-charcoal hover:border-aydin-red hover:text-aydin-red"
  );
}

// lucide-react no longer ships trademarked brand icons; small inline marks instead.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 9V6.5c0-.83.67-1.5 1.5-1.5H17V2h-2.5A4.5 4.5 0 0 0 10 6.5V9H7v3h3v10h4V12h2.6l.4-3H14Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 2h-3v13.5a2.5 2.5 0 1 1-2.5-2.5c.17 0 .34.01.5.04V9.96a5.98 5.98 0 0 0-.5-.02A6 6 0 1 0 17 16V8.5a7.4 7.4 0 0 0 4 1.17V6.65A4.5 4.5 0 0 1 16.5 2Z" />
    </svg>
  );
}

export function SiteFooter() {
  const { settings } = useSite();
  const maps = buildMapsLink(settings.address);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border-soft bg-warm-cream/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold text-charcoal">
            {settings.businessName}
          </p>
          {settings.tagline && (
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary-text">
              {settings.tagline}
            </p>
          )}
        </div>

        <div className="space-y-3 text-sm text-secondary-text">
          {settings.address && (
            <a
              href={maps ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-aydin-red"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {settings.address}
            </a>
          )}
          {settings.phone && (
            <a
              href={buildTelLink(settings.phone) ?? "#"}
              className="flex items-center gap-2 hover:text-aydin-red"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {settings.phone}
            </a>
          )}
          {settings.workingHours && (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              {settings.workingHours}
            </span>
          )}
        </div>

        <div className="flex items-start gap-3 md:justify-end">
          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft text-secondary-text transition hover:border-aydin-red hover:text-aydin-red"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          )}
          {settings.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft text-secondary-text transition hover:border-aydin-red hover:text-aydin-red"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          )}
          {settings.tiktok && (
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft text-secondary-text transition hover:border-aydin-red hover:text-aydin-red"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-border-soft/60 py-4 text-center text-xs text-secondary-text">
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


export function SiteHeader() {
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

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/70 bg-warm-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <Image src={settings.logoUrl} alt="" fill sizes="40px" className="object-cover" />
            </div>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aydin-red font-display text-lg font-extrabold text-white">
              A
            </span>
          )}
          <span className="font-display text-xl font-extrabold tracking-tight text-charcoal">
            {settings.businessName}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {settings.phone && (
            <a
              href={buildTelLink(settings.phone) ?? "#"}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border-soft text-secondary-text transition hover:border-aydin-red hover:text-aydin-red sm:flex"
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
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border-soft text-secondary-text transition hover:border-aydin-red hover:text-aydin-red sm:flex"
              aria-label="WhatsApp ile yaz"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Kategori şeridi */}
      {categories.length > 0 && (
        <nav className="border-t border-border-soft/60">
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
            <Link
              href="/#gunun-menusu"
              ref={pathname === "/" ? activeTabRef : undefined}
              className={navTabClass(pathname === "/")}
            >
              Günün Menüsü
            </Link>
            {categories.map((c) => {
              const href = `/kategori/${c.slug}`;
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
            <Link
              href="/iletisim"
              ref={pathname === "/iletisim" ? activeTabRef : undefined}
              className={navTabClass(pathname === "/iletisim")}
            >
              İletişim
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
