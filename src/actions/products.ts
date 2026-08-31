"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { productSchema, type ProductInput } from "@/lib/validations";
import { toSlug } from "@/lib/utils";
import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";

async function parseProduct(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code") ?? undefined,
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    shortDescription: formData.get("shortDescription") ?? undefined,
    longDescription: formData.get("longDescription") ?? undefined,
    calories: formData.get("calories") ?? undefined,
    allergenInfo: formData.get("allergenInfo") ?? undefined,
    imageUrl: formData.get("imageUrl") ?? "",
    isActive: formData.get("isActive") === "true",
    isSoldOut: formData.get("isSoldOut") === "true",
    showInDailyMenu: formData.get("showInDailyMenu") === "true",
    sortOrder: formData.get("sortOrder") ?? 0,
  });
}

export type ProductFormState =
  | { status: "error"; message: string }
  | { status: "ok"; id?: string };

export async function saveProductAction(
  id: string | undefined,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = await parseProduct(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const data: ProductInput = parsed.data;

  const updateData = {
    name: data.name,
    code: data.code ?? null,
    categoryId: data.categoryId,
    price: data.price,
    shortDescription: data.shortDescription ?? null,
    longDescription: data.longDescription ?? null,
    calories: data.calories ?? null,
    allergenInfo: data.allergenInfo ?? null,
    imageUrl: data.imageUrl || null,
    isActive: data.isActive,
    isSoldOut: data.isSoldOut,
    showInDailyMenu: data.showInDailyMenu,
    sortOrder: data.sortOrder ?? 0,
  };

  try {
    if (id) {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        return { status: "error", message: "Ürün bulunamadı." };
      }
      const updates: { slug?: string } = {};
      if (existing.name !== data.name) {
        updates.slug = toSlug(data.name);
      }
      await prisma.product.update({
        where: { id },
        data: { ...updateData, ...updates },
      });
    } else {
      const slug = toSlug(data.name);
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        return {
          status: "error",
          message: "Bu isimde bir ürün zaten var.",
        };
      }
      const maxOrder =
        (await prisma.product.count({ where: { categoryId: data.categoryId } })) >
        0
          ? (
              await prisma.product.aggregate({
                where: { categoryId: data.categoryId },
                _max: { sortOrder: true },
              })
            )._max.sortOrder
          : 0;

      const created = await prisma.product.create({
        data: {
          ...updateData,
          slug,
          sortOrder: data.sortOrder ?? (maxOrder ?? 0) + 1,
        },
      });
      return { status: "ok", id: created.id };
    }
    revalidatePath("/admin/products");
    return { status: "ok", id: id ? id : undefined };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bir hata oluştu.";
    return { status: "error", message };
  }
}

export async function toggleProductAction(
  id: string,
  field: "isActive" | "isSoldOut" | "showInDailyMenu"
): Promise<{ success: boolean }> {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { success: false };

  await prisma.product.update({
    where: { id },
    data: { [field]: !product[field] },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/daily-menu");
  return { success: true };
}

export async function deleteProductAction(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  await requireAdmin();

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/admin/daily-menu");
  return { success: true };
}

export async function reorderProductsAction(
  categoryId: string,
  orderedIds: string[]
): Promise<{ success: boolean }> {
  await requireAdmin();

  for (const [index, id] of orderedIds.entries()) {
    await prisma.product.update({
      where: { id, categoryId },
      data: { sortOrder: index },
    });
  }
  revalidatePath("/admin/products");
  return { success: true };
}

export async function uploadProductImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; message?: string }> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, message: "Dosya seçilmedi." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name.match(/\.([^.]+)$/)?.[1] ?? "jpg").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const dir = join(process.cwd(), "public", "uploads", "products");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, filename), buffer);
  const url = `/uploads/products/${filename}`;

  revalidatePath("/admin/products");
  return { success: true, url };
}
