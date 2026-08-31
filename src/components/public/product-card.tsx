import Link from "next/link";
import Image from "next/image";
import { Soup } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  shortDescription: string | null;
  imageUrl: string | null;
  isSoldOut: boolean;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const soldOut = product.isSoldOut;

  return (
    <Link
      href={`/urun/${product.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        soldOut ? "opacity-70" : ""
      }`}
    >
      {/* Görsel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-warm-cream">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition group-hover:scale-[1.03] ${
              soldOut ? "opacity-60" : ""
            }`}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-border-soft">
            <Soup className="h-10 w-10" />
          </span>
        )}

        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-sold-out px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Tükendi
          </span>
        )}
      </div>

      {/* Bilgi */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h4 className="font-display text-base font-bold leading-snug text-charcoal">
          {product.name}
        </h4>
        {product.shortDescription && (
          <p className="line-clamp-2 text-sm text-secondary-text">
            {product.shortDescription}
          </p>
        )}
        <span className="mt-auto pt-2 text-lg font-extrabold text-charcoal">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}
