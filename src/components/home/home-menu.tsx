import Image from "next/image";
import Link from "next/link";
import { DailyMenuTabldotHighlight } from "@/components/public/daily-menu-tabldot-highlight";
import { withDailyMenuAutoSoldOut } from "@/lib/daily-menu-status";
import { formatPrice } from "@/lib/utils";
import type { getDailyMenuProducts } from "@/lib/data/products";
import type { getActiveCategoriesWithActiveProducts } from "@/lib/data/categories";

type DailyProduct = Awaited<ReturnType<typeof getDailyMenuProducts>>[number];
type Category = Awaited<ReturnType<typeof getActiveCategoriesWithActiveProducts>>[number];
type Row = { id: string; slug: string; name: string; price: number; isSoldOut: boolean };

const DONER_COUNT = 3;

function Rows({ rows }: { rows: Row[] }) {
  return (
    <ul>
      {rows.map((p) => (
        <li key={p.id}>
          <Link href={`/menu/urun/${p.slug}`} className="cine-row" data-soldout={p.isSoldOut ? "1" : undefined}>
            <span className="cine-row-name">
              {p.name}
              {p.isSoldOut && <em className="cine-soldout">Tükendi</em>}
            </span>
            <span className="cine-row-price">{formatPrice(p.price)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Compact home menu: today's menu, three döner items, one button to the full /menu page. */
export function HomeMenu({
  dailyMenu,
  categories,
}: {
  dailyMenu: DailyProduct[];
  categories: Category[];
}) {
  const daily = withDailyMenuAutoSoldOut(dailyMenu);
  const groups = new Map<string, { name: string; items: DailyProduct[] }>();
  for (const p of daily) {
    const g = groups.get(p.category.id) ?? { name: p.category.name, items: [] };
    g.items.push(p);
    groups.set(p.category.id, g);
  }

  const doner =
    categories.find((c) => c.slug === "doner") ??
    categories.find((c) => /d[öo]ner/i.test(c.name));
  const donerRows = doner?.products.slice(0, DONER_COUNT) ?? [];

  return (
    <section id="menu" className="cine-solid cine-menu">
      <div className="cine-menu-bg" aria-hidden="true">
        <Image
          src="/frames/poster/menu.webp"
          alt=""
          fill
          unoptimized
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="cine-wrap">
        <p className="cine-tag">Menü</p>
        <h2 className="cine-h2 cine-h2-sm">Menü</h2>

        <div className="cine-menu-cols">
          <div className="cine-card">
            <h3 className="cine-card-title">Günün Menüsü</h3>
            <div className="cine-tabldot">
              <DailyMenuTabldotHighlight />
            </div>
            {groups.size === 0 ? (
              <p className="cine-card-note">Bugünün menüsü henüz hazırlanmadı.</p>
            ) : (
              Array.from(groups.values()).map((g) => (
                <div key={g.name} className="cine-group">
                  <p className="cine-group-name">{g.name}</p>
                  <Rows rows={g.items} />
                </div>
              ))
            )}
          </div>

          {donerRows.length > 0 && (
            <div className="cine-card">
              <h3 className="cine-card-title">{doner?.name ?? "Döner"}</h3>
              <Rows rows={donerRows} />
            </div>
          )}
        </div>

        <div className="cine-actions cine-menu-end">
          <Link href="/menu" className="cine-btn cine-btn-red">
            Tüm Menüyü Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
