"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { toggleDailyMenuAction } from "@/actions/dailyMenu";

type Row = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  isSoldOut: boolean;
  showInDailyMenu: boolean;
  category: { id: string; name: string };
};

export function DailyMenuClient({
  initialDailyIds,
  products,
}: {
  initialDailyIds: string[];
  products: Row[];
}) {
  return (
    <ToastProvider>
      <Inner initialDailyIds={initialDailyIds} products={products} />
    </ToastProvider>
  );
}

function Inner({
  initialDailyIds,
  products,
}: {
  initialDailyIds: string[];
  products: Row[];
}) {
  const { addToast } = useToast();
  const [dailyIds, setDailyIds] = useState<Set<string>>(new Set(initialDailyIds));
  const [, startTransition] = useTransition();

  // Sadece aktif ürünler günün menüsüne alınabilir
  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive),
    [products]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>();
    activeProducts.forEach((p) => {
      if (!map.has(p.category.name)) map.set(p.category.name, []);
      map.get(p.category.name)!.push(p);
    });
    return Array.from(map.entries());
  }, [activeProducts]);

  const toggle = (product: Row) => {
    const willShow = !dailyIds.has(product.id);
    startTransition(async () => {
      await toggleDailyMenuAction(product.id, willShow);
      setDailyIds((prev) => {
        const next = new Set(prev);
        if (willShow) next.add(product.id);
        else next.delete(product.id);
        return next;
      });
      addToast(
        willShow
          ? `${product.name} günün menüsüne eklendi.`
          : `${product.name} günün menüsünden çıkarıldı.`,
        "success"
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Günün Menüsü</h1>
          <p className="text-sm text-secondary-text">
            Bugün menüde olacak ürünleri işaretleyin. Değişiklikler anında müşteri menüsüne yansır.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-border-soft px-4 py-2 text-sm text-secondary-text hover:bg-warm-cream hover:text-aydin-red-dark"
        >
          <ExternalLink className="h-4 w-4" />
          Menüyü Görüntüle
        </Link>
      </div>

      <div className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
        <p className="text-sm text-secondary-text">
          Şu anda seçili:{" "}
          <span className="font-semibold text-charcoal">{dailyIds.size} ürün</span>{" "}
        </p>
      </div>

      <div className="space-y-6">
        {grouped.map(([categoryName, items]) => (
          <div key={categoryName}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary-text">
              {categoryName}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border-soft bg-warm-white shadow-sm">
              <ul className="divide-y divide-border-soft">
                {items.map((p) => {
                  const inMenu = dailyIds.has(p.id);
                  return (
                    <li key={p.id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-charcoal">{p.name}</span>
                        {p.isSoldOut && <Badge variant="soldout">Tükendi</Badge>}
                        <span className="text-sm font-semibold text-charcoal">
                          {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(p.price)}
                        </span>
                      </div>
                      <Switch checked={inMenu} onChange={() => toggle(p)} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="rounded-xl border border-border-soft bg-warm-white p-10 text-center text-secondary-text">
            Aktif ürün bulunamadı. Önce ürün ekleyin veya pasif ürünleri aktifleştirin.
          </div>
        )}
      </div>
    </div>
  );
}
