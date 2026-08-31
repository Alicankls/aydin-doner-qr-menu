"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  CategoryForm,
  type Category,
  useCategoryActions,
} from "@/components/admin/category-form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToastProvider, useToast } from "@/components/ui/toast";

type CategoriesClientProps = {
  initialCategories: (Category & { _count: { products: number } })[];
};

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  return (
    <ToastProvider>
      <Inner initialCategories={initialCategories} />
    </ToastProvider>
  );
}

function Inner({ initialCategories }: CategoriesClientProps) {
  const { addToast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [, startTransition] = useTransition();

  const actions = useCategoryActions();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setFormOpen(true);
  };

  const handleSaved = (result: { status: string; message?: string }) => {
    if (result.status === "ok") {
      addToast(editing ? "Kategori güncellendi." : "Kategori eklendi.", "success");
      setFormOpen(false);
      setEditing(null);
        } else {
      addToast(result.message ?? "Bir hata oluştu.", "error");
    }
  };

  const handleToggle = async (category: Category) => {
    startTransition(async () => {
      await actions.toggleActive(category.id, category.isActive);
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id ? { ...c, isActive: !c.isActive } : c
        )
      );
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await actions.remove(deleteTarget.id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        addToast("Kategori silindi.", "success");
      } else {
        addToast(result.message ?? "Silinemedi.", "error");
      }
      setDeleteTarget(null);
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...categories];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setCategories(newOrder);
    startTransition(() =>
      actions.reorder(newOrder.map((c) => c.id)).then((r) => {
        if (!r.success && r.message) addToast(r.message, "error");
      })
    );
  };

  const moveDown = (index: number) => {
    if (index >= categories.length - 1) return;
    const newOrder = [...categories];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setCategories(newOrder);
    startTransition(() =>
      actions.reorder(newOrder.map((c) => c.id)).then((r) => {
        if (!r.success && r.message) addToast(r.message, "error");
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Kategoriler</h1>
          <p className="text-sm text-secondary-text">
            Menü kategorilerini yönetin, sıralayın ve aktif/pasif yapın.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Kategori Ekle
        </Button>
      </div>


      <div className="overflow-x-auto rounded-xl border border-border-soft bg-warm-white shadow-sm">
        <table className="min-w-full divide-y divide-border-soft">
          <thead className="bg-warm-cream/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Sıra</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Ad</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Ürün Sayısı</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-text">Durum</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-secondary-text">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft bg-warm-white">
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-secondary-text">
                  Henüz kategori yok. “Kategori Ekle” ile başlayın.
                </td>
              </tr>
            )}
            {categories.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-warm-cream/40">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-charcoal">
                  <span className="inline-flex gap-1">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="rounded p-1 hover:bg-warm-cream disabled:opacity-30" aria-label="Yukarı taşı">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => moveDown(index)} disabled={index === categories.length - 1} className="rounded p-1 hover:bg-warm-cream disabled:opacity-30" aria-label="Aşağı taşı">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3 font-medium text-charcoal">{cat.name}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-secondary-text">{cat.slug}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-secondary-text">{cat._count.products}</td>
                <td className="whitespace-nowrap px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Switch checked={cat.isActive} onChange={() => handleToggle(cat)} />
                    <Badge variant={cat.isActive ? "active" : "inactive"}>
                      {cat.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(cat)} className="rounded-lg p-2 text-secondary-text hover:bg-warm-cream hover:text-aydin-red-dark" aria-label="Düzenle">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} className="rounded-lg p-2 text-secondary-text hover:bg-red-50 hover:text-red-600" aria-label="Sil">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <Dialog open onClose={() => setFormOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Kategoriyi Düzenle" : "Yeni Kategori"}</DialogTitle>
              <DialogDescription>
                {editing
                  ? `${editing.name} kategorisini düzenliyorsunuz.`
                  : "Menüde görünecek yeni bir kategori oluşturun."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <CategoryForm key={editing?.id ?? "new"} category={editing ?? undefined} onSaved={handleSaved} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {deleteTarget && (
        <Dialog open onClose={() => setDeleteTarget(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kategoriyi Sil</DialogTitle>
              <DialogDescription>
                “{deleteTarget.name}” kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
