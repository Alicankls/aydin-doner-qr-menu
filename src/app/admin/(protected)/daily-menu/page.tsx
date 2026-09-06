import { getDailyMenuProducts, getAllProducts } from "@/lib/data/products";
import { withDailyMenuAutoSoldOut } from "@/lib/daily-menu-status";
import { DailyMenuClient } from "@/components/admin/daily-menu-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Günün Menüsü | Aydın Döner Menü Yönetim",
};

export default async function DailyMenuPage() {
  const [dailyProducts, allProducts] = await Promise.all([
    getDailyMenuProducts(),
    getAllProducts(),
  ]);

  return (
    <DailyMenuClient
      initialDailyIds={dailyProducts.map((p) => p.id)}
      products={withDailyMenuAutoSoldOut(allProducts)}
    />
  );
}
