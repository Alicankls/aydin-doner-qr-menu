"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { BrandLogo } from "@/components/public/brand-logo";
import Link from "next/link";
import { MessageCircle, Utensils } from "lucide-react";

type Props = {
  businessName: string;
  logoUrl: string | null;
  subtitle: string;
  workingHours: string | null;
  whatsappHref: string | null;
  children: ReactNode;
};

type Pos = "start" | "end" | "center";

function Item({
  a,
  b,
  pos = "start",
  children,
}: {
  a: number;
  b: number;
  pos?: Pos;
  children: ReactNode;
}) {
  return (
    <div
      className="cine-item"
      data-cine-item=""
      data-in={a}
      data-out={b}
      data-pos={pos}
    >
      {children}
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return <p className="cine-tag">{label}</p>;
}

function Scene({
  n,
  height,
  poster,
  alt,
  children,
}: {
  n: number;
  height: number;
  poster: string;
  alt: string;
  children: ReactNode;
}) {
  return (
    <section
      className="cine-scene"
      data-scene={n}
      style={{ ["--scene-h" as string]: `${height}svh` }}
    >
      <div className="cine-stage">
        {/* static-mode image; hidden (and never fetched) in animated mode */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="cine-static-poster"
          src={poster}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={800}
          height={450}
        />
        <div className="cine-copy">{children}</div>
      </div>
    </section>
  );
}

const INGREDIENTS = ["Et", "Domates", "Soğan", "Marul"];

const MARQUEE_WORDS = ["Taze", "Sıcak", "Çorlu", "Aydın Döner"];

function Marquee() {
  // two identical halves: the CSS animation slides by exactly one half, so it loops without a jump
  const half = (key: string) => (
    <span className="cine-marquee-half" key={key}>
      {Array.from({ length: 6 }).flatMap((_, r) =>
        MARQUEE_WORDS.map((w) => (
          <span className="cine-marquee-item" key={`${key}${r}${w}`}>
            {w}
          </span>
        ))
      )}
    </span>
  );
  return (
    <div className="cine-marquee" aria-hidden="true">
      <div className="cine-marquee-track">
        {half("a")}
        {half("b")}
      </div>
    </div>
  );
}

export function CinematicHome({
  businessName,
  logoUrl,
  subtitle,
  workingHours,
  whatsappHref,
  children,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>("#cine-root");
    if (!root || root.dataset.mode === "static") return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let timer = 0;
    const boot = () => {
      // GSAP + Lenis are only fetched here, on the home page, after the
      // document has finished loading so the hero paints first.
      import("@/lib/cinematic/engine").then(({ startEngine }) => {
        if (cancelled) return;
        root.dataset.mode = "cinematic";
        cleanup = startEngine(root);
        // optional polish (SplitText, magnetic buttons, progress bar): a separate chunk, after the engine
        import("@/lib/cinematic/effects").then(({ startEffects }) => {
          if (cancelled) return;
          const stopEffects = startEffects(root);
          const stopEngine = cleanup;
          cleanup = () => {
            stopEffects();
            stopEngine?.();
          };
        });
      });
    };
    const afterLoad = () => {
      timer = window.setTimeout(boot, 50);
    };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", afterLoad);
      cleanup?.();
      delete root.dataset.mode;
      delete root.dataset.drawn;
      delete root.dataset.ready;
    };
  }, []);

  return (
    <div ref={rootRef} className="cine">
      {/* always-visible shortcuts */}
      <header className="cine-topbar">
        <Link href="/" className="cine-brand" aria-label={`${businessName}, ana sayfa`}>
          {logoUrl && <BrandLogo src={logoUrl} size={38} priority />}
          <span className="cine-wordmark">{businessName}</span>
        </Link>
        <nav aria-label="Hızlı erişim" className="cine-quick">
          <Link href="/menu" className="cine-btn cine-btn-red cine-btn-sm">
            <Utensils aria-hidden="true" className="h-4 w-4 cine-btn-icon-optional" />
            Menü
          </Link>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ile yaz"
              className="cine-btn cine-btn-ghost cine-btn-sm"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              <span className="cine-btn-label">WhatsApp</span>
            </a>
          )}
        </nav>
      </header>

      {/* fixed layers behind the scenes */}
      <div className="cine-layer" aria-hidden="true">
        <Image
          className="cine-layer-poster"
          src="/frames/poster/sahne-1.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          unoptimized
          sizes="100vw"
        />
        <canvas className="cine-canvas" data-cine-canvas="" />
      </div>

      <div className="cine-progress" aria-hidden="true">
        <span className="cine-progress-bar" data-cine-progress="" />
      </div>

      <div className="cine-loader" aria-hidden="true">
        <span className="cine-loader-bar" data-cine-loader-bar="" />
      </div>

      <div className="cine-hud" data-cine-hud="" data-on="0" aria-hidden="true">
        <span className="cine-hud-label">Sıcaklık</span>
        <span className="cine-hud-value">
          <span data-cine-temp="">020</span>
          <span className="cine-hud-unit">°C</span>
        </span>
        <span className="cine-hud-track">
          <span className="cine-hud-bar" data-cine-bar="" />
        </span>
      </div>

      <main id="icerik">
        {/* 01: one take. skewer at the fire, macro, knife, onto the lavaş */}
        <Scene n={1} height={560} poster="/frames/poster/sahne-1.webp" alt="Ateşte dönen döner şişi">
          <Item a={0} b={0.26} pos="end">
            <Tag label="Çorlu" />
            <h1 className="cine-h1">{businessName}</h1>
            <p className="cine-lead">{subtitle}</p>
            <div className="cine-actions">
              <Link href="/menu" className="cine-btn cine-btn-red">
                Menüyü Gör
              </Link>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cine-btn cine-btn-light"
                >
                  WhatsApp&apos;tan Sipariş Ver
                </a>
              )}
            </div>
            {workingHours && <p className="cine-meta">{workingHours}</p>}
          </Item>
          <Item a={0.32} b={0.6} pos="end">
            <Tag label="Ateş" />
            <h2 className="cine-h2">Ateşte.</h2>
            <p className="cine-lead">Her gün taze, ateşte.</p>
          </Item>
          <Item a={0.66} b={0.81} pos="start">
            <Tag label="Kesim" />
            <h2 className="cine-h2">İnce kesim.</h2>
          </Item>
          <Item a={0.87} b={1} pos="end">
            <Tag label="Lavaş" />
            <h2 className="cine-h2">Lavaşa veya ekmeğe.</h2>
            <p className="cine-lead">Bolca et, domates, soğan, marul.</p>
          </Item>
        </Scene>

        {/* 02: the wrap bursts into its ingredients */}
        <Scene n={2} height={380} poster="/frames/poster/sahne-2.webp" alt="Havada uçuşan döner malzemeleri">
          {INGREDIENTS.map((word, i) => {
            const span = 0.68 / INGREDIENTS.length;
            const start = 0.12 + i * span;
            return (
              <Item key={word} a={start} b={start + span} pos={i % 2 === 0 ? "start" : "end"}>
                <Tag label="Malzeme" />
                <h2 className="cine-h2 cine-word">{word}</h2>
              </Item>
            );
          })}
          <Item a={0.84} b={1} pos="end">
            <Tag label="Sofra" />
            <h2 className="cine-h2">Hepsi bir arada.</h2>
            <p className="cine-lead">Menüye göz at, siparişini ver.</p>
            <div className="cine-actions">
              <Link href="/menu" className="cine-btn cine-btn-red">
                Menüyü Gör
              </Link>
            </div>
          </Item>
        </Scene>

        {/* own row in the normal flow: after the last scene, directly above the menu */}
        <Marquee />

        {/* menu + contact are rendered on the server and passed in */}
        {children}
      </main>
    </div>
  );
}
