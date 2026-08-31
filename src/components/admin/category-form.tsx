"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import {
  saveCategoryAction,
  deleteCategoryAction,
  toggleCategoryAction,
  reorderCategoriesAction,
  type CategoryFormState,
} from "@/actions/categories";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  _count?: { products: number };
};

export function CategoryForm({
  category,
  onSaved,
}: {
  category?: Category;
  onSaved: (result: CategoryFormState) => void;
}) {
  const isEdit = Boolean(category);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      order: category?.order ?? 0,
    },
  });

  const onSubmit = (data: CategoryInput) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("order", String(data.order ?? 0));
    formData.set("isActive", String(true));

    startTransition(async () => {
      const result = await saveCategoryAction(category?.id, formData);
      onSaved(result);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal">
          Kategori Adı
        </label>
        <Input
          {...register("name")}
          placeholder="Örn: Günün Çorbaları"
          className="mt-1"
          autoFocus
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full" variant="primary">
        {isPending ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ekle"}
      </Button>
    </form>
  );
}

export function useCategoryActions() {
  const [isPending] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggleActive = async (id: string, isActive: boolean) => {
    setError(null);
    await toggleCategoryAction(id, "isActive");
    return !isActive;
  };

  const remove = async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    setError(null);
    const result = await deleteCategoryAction(id);
    if (!result.success && result.message) setError(result.message);
    return result;
  };

  const reorder = async (orderedIds: string[]) => {
    setError(null);
    const result = await reorderCategoriesAction(orderedIds);
    if (!result.success && result.message) setError(result.message);
    return result;
  };

  return { isPending, error, toggleActive, remove, reorder };
}

