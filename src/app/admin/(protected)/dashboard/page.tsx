import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Package,
  Tags,
  CalendarDays,
  TrendingUp,
  Cloud,
} from "lucide-react";

async function getStats() {
  const [
    totalProducts,
    activeProducts,
    soldOutProducts,
    dailyMenuProducts,
    totalCategories,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isSoldOut: true } }),
    prisma.product.count({ where: { showInDailyMenu: true } }),
    prisma.category.count({ where: { isActive: true } }),
  ]);

  return {
    totalProducts,
    activeProducts,
    soldOutProducts,
    dailyMenuProducts,
    totalCategories,
  };
}

const StatCard = ({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactElement;
  href?: string;
}) => {
  const inner = (
    <div className="flex items-center gap-4 rounded-xl border border-border-soft bg-warm-white px-5 py-4 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-aydin-red/10 text-aydin-red">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-charcoal">{value}</p>
        <p className="text-sm text-secondary-text">{label}</p>
      </div>
    </div>
  );
  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
};

export default async function DashboardPage() {
  const stats = await getStats();

  const quickActions = [
    { label: "Kategori Yönet", href: "/admin/categories", icon: Tags },
    { label: "Ürün Ekle", href: "/admin/products/new", icon: Package },
    { label: "Günün Menüsü", href: "/admin/daily-menu", icon: CalendarDays },
    { label: "Ayarlar", href: "/admin/settings", icon: Cloud },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal font-display">
          Dashboard
        </h1>
        <p className="text-sm text-secondary-text">
          Aydın Döner menü yönetim panelinize hoş geldiniz.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Toplam Ürün"
          value={stats.totalProducts}
          icon={<Package className="h-6 w-6" />}
          href="/admin/products"
        />
        <StatCard
          label="Aktif Ürün"
          value={stats.activeProducts}
          icon={<TrendingUp className="h-6 w-6" />}
          href="/admin/products"
        />
        <StatCard
          label="Tükendi"
          value={stats.soldOutProducts}
          icon={<Cloud className="h-6 w-6" />}
          href="/admin/products"
        />
        <StatCard
          label="Günün Menüsü"
          value={stats.dailyMenuProducts}
          icon={<CalendarDays className="h-6 w-6" />}
          href="/admin/daily-menu"
        />
        <StatCard
          label="Kategori"
          value={stats.totalCategories}
          icon={<Tags className="h-6 w-6" />}
          href="/admin/categories"
        />
      </div>

      <div className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-charcoal">
          Hızlı Erişim
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 rounded-lg border border-border-soft p-3 text-sm font-medium text-charcoal hover:bg-warm-cream hover:text-aydin-red-dark"
            >
              <a.icon className="h-5 w-5" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
