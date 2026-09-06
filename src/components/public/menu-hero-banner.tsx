import Image from "next/image";
import { getStaticImage } from "@/lib/static-image";

export function MenuHeroBanner({
  businessName,
  logoUrl,
}: {
  businessName: string;
  logoUrl: string | null;
}) {
  const heroImage = getStaticImage("images/hero-aydin-doner-lokanta.png");

  return (
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

        {logoUrl && (
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-warm-white p-1 shadow-lg sm:h-24 sm:w-24">
            <Image
              src={logoUrl}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        )}

        <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-warm-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-6xl">
          {businessName}
        </h1>
      </div>
    </section>
  );
}
