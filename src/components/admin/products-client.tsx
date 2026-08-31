"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, ImageOff } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToastProvider, useToast } from "@/components/ui/toast";
import {
  toggleProductAction,
  deleteProductAction,
} from "@/actions/products";
import { formatPrice } from "@/lib/utils";

type AdminProductRow = {
  id: string;
  name: string;
  code: string | null;
  price: number;
  isActive: boolean;
  isSoldOut: boolean;
  showInDailyMenu: boolean;
  sortOrder: number;
  imageUrl: string | null;
  category: { id: string; name: string };
};

export function ProductsClient({
  initialProducts,
}: {
  initialProducts: AdminProductRow[];
}) {
  return (
    <ToastProvider>
      <Inner initialProducts={initialProducts} />
    </ToastProvider>
  );
}

function Inner({ initialProducts }: { initialProducts: AdminProductRow[] }) {
  const { addToast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);
  const [, startTransition] = useTransition();

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.category.id, p.category.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && p.category.id !== categoryFilter) return false;
    return true;
  });

  const handleToggle = (
    product: AdminProductRow,
    field: "isActive" | "isSoldOut" | "showInDailyMenu"
  ) => {
    startTransition(async () => {
      await toggleProductAction(product.id, field);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, [field]: !p[field] } : p
        )
      );
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteProductAction(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      addToast("Ürün silindi.", "success");
      setDeleteTarget(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Ürünler</h1>
          <p className="text-sm text-secondary-text">
            Menüdeki tüm ürünleri buradan yönetin.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ürün Ekle
          </Button>
        </Link>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text/60" />
          <Input
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-auto min-w-[180px]"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Tablo */}
      <ProductTable products={filtered} onToggle={handleToggle} onDelete={(p) => setDeleteTarget(p)} />

      {deleteTarget && (
        <Dialog open onClose={() => setDeleteTarget(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ürünü Sil</DialogTitle>
              <DialogDescription>
                &ldquo;{deleteTarget.name}&rdquo; ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ProductTable({
  products,
  onToggle,
  onDelete,
}: {
  products: AdminProductRow[];
  onToggle: (p: AdminProductRow, field: "isActive" | "isSoldOut" | "showInDailyMenu") => void;
  onDelete: (p: AdminProductRow) => void;
}) {
  const statusBadge = (p: AdminProductRow): { label: string; variant: BadgeVariant } => {
    if (!p.isActive) return { label: "Pasif", variant: "inactive" };
    if (p.isSoldOut) return { label: "Tükendi", variant: "soldout" };
    if (p.showInDailyMenu) return { label: "Günün Menüsü", variant: "daily" };
    return { label: "Aktif", variant: "active" };
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border-soft bg-warm-white shadow-sm">
      <table className="min-w-full divide-y divide-border-soft">
        <thead className="bg-warm-cream/60">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Görsel</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Ad</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Kategori</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Kod</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Fiyat</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Durum</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-secondary-text">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft bg-warm-white">
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-secondary-text">
                Sonuç bulunamadı.
              </td>
            </tr>
          )}
          {products.map((p) => {
            const badge = statusBadge(p);
            return (
              <tr key={p.id} className={`hover:bg-warm-cream/40 ${!p.isActive ? "opacity-60" : ""}`}>
                <td className="px-6 py-2">
                  {p.imageUrl ? (
                    <div className="relative h-12 w-16 overflow-hidden rounded-md">
                      <Image src={p.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  ) : (
                    <span className="flex h-12 w-16 items-center justify-center rounded-md bg-border-soft/50 text-secondary-text/50">
                      <ImageOff className="h-5 w-5" />
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-3 font-medium text-charcoal">{p.name}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-secondary-text">{p.category.name}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-secondary-text">{p.code ?? "-"}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-charcoal">
                  {formatPrice(p.price)}
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggle(p, "isSoldOut")}
                      title={p.isSoldOut ? "Tükendi işaretini kaldır" : "Tükendi olarak işaretle"}
                      className="rounded-lg px-2 py-1 text-xs text-secondary-text hover:bg-warm-cream hover:text-sold-out"
                    >
                      {p.isSoldOut ? "Satışa Aç" : "Tükendi"}
                    </button>
                    <button
                      onClick={() => onToggle(p, "showInDailyMenu")}
                      title={p.showInDailyMenu ? "Günün menüsünden çıkar" : "Günün menüsüne ekle"}
                      className="rounded-lg px-2 py-1 text-xs text-secondary-text hover:bg-warm-cream hover:text-aydin-red-dark"
                    >
                      {p.showInDailyMenu ? "Menüden Çıkar" : "Günün Menüsü"}
                    </button>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="rounded-lg p-2 text-secondary-text hover:bg-warm-cream hover:text-aydin-red-dark"
                      aria-label="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(p)}
                      className="rounded-lg p-2 text-secondary-text hover:bg-red-50 hover:text-red-600"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
