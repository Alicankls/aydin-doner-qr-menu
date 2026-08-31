"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  saveProductAction,
  type ProductFormState,
} from "@/actions/products";
import { productSchema, type ProductInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/image-uploader";

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  price: number;
  shortDescription: string | null;
  longDescription: string | null;
  calories: number | null;
  allergenInfo: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isSoldOut: boolean;
  showInDailyMenu: boolean;
  sortOrder: number;
  categoryId: string;
};

export function ProductForm({
  product,
  categories,
  onSaved,
}: {
  product?: AdminProduct;
  categories: { id: string; name: string }[];
  onSaved: (result: ProductFormState) => void;
}) {
  const isEdit = Boolean(product);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      code: product?.code ?? "",
      categoryId: product?.categoryId ?? "",
      price: product?.price ?? 0,
      shortDescription: product?.shortDescription ?? "",
      longDescription: product?.longDescription ?? "",
      calories: product?.calories ?? undefined,
      allergenInfo: product?.allergenInfo ?? "",
      imageUrl: product?.imageUrl ?? "",
      isActive: product ? product.isActive : true,
      isSoldOut: product?.isSoldOut ?? false,
      showInDailyMenu: product?.showInDailyMenu ?? false,
      sortOrder: product?.sortOrder ?? 0,
    },
  });

  const imageUrl = watch("imageUrl");
  const isActive = watch("isActive");
  const isSoldOut = watch("isSoldOut");
  const showInDailyMenu = watch("showInDailyMenu");

  const onSubmit = (data: ProductInput) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("code", data.code ?? "");
    formData.set("categoryId", data.categoryId);
    formData.set("price", String(data.price));
    formData.set("shortDescription", data.shortDescription ?? "");
    formData.set("longDescription", data.longDescription ?? "");
    if (data.calories !== undefined && data.calories !== null) {
      formData.set("calories", String(data.calories));
    }
    formData.set("allergenInfo", data.allergenInfo ?? "");
    formData.set("imageUrl", data.imageUrl ?? "");
    formData.set("isActive", String(isActive));
    formData.set("isSoldOut", String(isSoldOut));
    formData.set("showInDailyMenu", String(showInDailyMenu));
    formData.set("sortOrder", String(data.sortOrder ?? 0));

    startTransition(async () => {
      const result = await saveProductAction(product?.id, formData);
      onSaved(result);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sol: temel bilgiler */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-charcoal">Temel Bilgiler</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal">Ürün Adı *</label>
                <Input {...register("name")} placeholder="Örn: Mercimek Çorbası" className="mt-1" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-charcoal">Kategori *</label>
                  <Select {...register("categoryId")} className="mt-1">
                    <option value="">Seçiniz</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal">Ürün Kodu</label>
                  <Input {...register("code")} placeholder="Örn: COR-001" className="mt-1" />
                  {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-charcoal">Fiyat (₺) *</label>
                  <Input type="number" step="0.01" min="0" {...register("price")} className="mt-1" />
                  {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal">Kalori (kcal)</label>
                  <Input
                    type="number"
                    min="0"
                    {...register("calories")}
                    className="mt-1"
                    placeholder="Boş bırakılabilir"
                  />
                  {errors.calories && (
                    <p className="mt-1 text-xs text-red-600">{errors.calories.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal">Kısa Açıklama</label>
                <Textarea
                  {...register("shortDescription")}
                  placeholder="Menü kartında görünecek kısa tanım"
                  className="mt-1"
                  rows={2}
                />
                {errors.shortDescription && (
                  <p className="mt-1 text-xs text-red-600">{errors.shortDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal">Detaylı Açıklama</label>
                <Textarea
                  {...register("longDescription")}
                  placeholder="Ürün detay sayfasında görünecek uzun açıklama"
                  className="mt-1"
                  rows={5}
                />
                {errors.longDescription && (
                  <p className="mt-1 text-xs text-red-600">{errors.longDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal">Alerjen Bilgisi</label>
                <Input
                  {...register("allergenInfo")}
                  placeholder="Örn: Gluten, süt ürünleri içerir."
                  className="mt-1"
                />
                {errors.allergenInfo && (
                  <p className="mt-1 text-xs text-red-600">{errors.allergenInfo.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ: görsel ve durum */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-charcoal">Görsel</h2>
            <ImageUploader value={imageUrl ?? null} onChange={(url) => setValue("imageUrl", url ?? "")} />
          </div>

          <div className="space-y-4 rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal">Durum</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal">Aktif / Pasif</span>
              <Switch checked={isActive} onChange={(v) => setValue("isActive", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-charcoal">Tükendi</span>
                <p className="text-xs text-secondary-text">Menüde soluk gösterilir.</p>
              </div>
              <Switch checked={isSoldOut} onChange={(v) => setValue("isSoldOut", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-charcoal">Günün Menüsü</span>
                <p className="text-xs text-secondary-text">Öne çıkan bölümde listelenir.</p>
              </div>
              <Switch checked={showInDailyMenu} onChange={(v) => setValue("showInDailyMenu", v)} />
            </div>
          </div>

          <div className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-charcoal">Sıralama</h2>
            <Input type="number" min="0" {...register("sortOrder")} />
            <p className="mt-1 text-xs text-secondary-text">
              Küçük değer önce gösterilir. Boşsa en sona eklenir.
            </p>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isPending} size="lg" variant="primary">
        {isPending ? "Kaydediliyor..." : isEdit ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
      </Button>
    </form>
  );
}
