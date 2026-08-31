"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { toSlug } from "@/lib/utils";

export type CategoryFormState =
  | { status: "error"; message: string }
  | { status: "ok" };

export async function saveCategoryAction(
  id: string | undefined,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    order: formData.get("order"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const data: CategoryInput = parsed.data;
  const order = Number(data.order ?? 0);

  try {
    if (id) {
      await prisma.category.update({
        where: { id },
        data: { name: data.name, order },
      });
    } else {
      const slug = toSlug(data.name);
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        return { status: "error", message: "Bu isimde bir kategori zaten var." };
      }

      const maxOrderRow = await prisma.category.aggregate({
        _max: { order: true },
      });
      const maxOrder = maxOrderRow._max.order ?? -1;

      await prisma.category.create({
        data: {
          name: data.name,
          slug,
          order: order > maxOrder ? maxOrder + 1 : order,
        },
      });
    }
    revalidatePath("/admin/categories");
    return { status: "ok" };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bir hata oluştu.";
    return { status: "error", message };
  }
}

export async function toggleCategoryAction(
  id: string,
  field: "isActive"
): Promise<{ success: boolean }> {
  await requireAdmin();

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return { success: false };

  await prisma.category.update({
    where: { id },
    data: { [field]: !category[field] },
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return {
      success: false,
      message: `Bu kategoriye ${productCount} ürün bağlı. Önce ürünleri başka kategoriye taşıyın veya silin.`,
    };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function reorderCategoriesAction(
  orderedIds: string[]
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  try {
    for (const [index, id] of orderedIds.entries()) {
      await prisma.category.update({
        where: { id },
        data: { order: index },
      });
    }
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sıralama güncellenemedi.";
    return { success: false, message };
  }
}
