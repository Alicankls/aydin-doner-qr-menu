import Link from "next/link";
import Image from "next/image";
import { Soup } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  shortDescription: string | null;
  imageUrl: string | null;
  isSoldOut: boolean;
  calories?: number | null;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const soldOut = product.isSoldOut;

  return (
    <Link
      href={`/menu/urun/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-aydin-red/25 hover:shadow-lg hover:shadow-charcoal/5",
        soldOut && "opacity-75"
      )}
    >
      {/* Görsel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-warm-cream">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover transition duration-500 group-hover:scale-105",
              soldOut && "opacity-60 grayscale-[0.4]"
            )}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-aydin-red/20">
            <Soup className="h-10 w-10" />
          </span>
        )}

        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-sold-out px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
            Tükendi
          </span>
        )}
      </div>

      {/* Bilgi */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h4 className="font-display text-base font-bold leading-snug text-charcoal">
          {product.name}
        </h4>
        {product.shortDescription && (
          <p className="line-clamp-2 text-sm leading-relaxed text-secondary-text">
            {product.shortDescription}
          </p>
        )}
        {product.calories != null && (
          <p className="text-xs font-medium text-secondary-text">
            {product.calories} kcal
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="h-px flex-1 bg-border-soft/70" aria-hidden="true" />
          <span className="text-lg font-extrabold text-aydin-red-dark">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
