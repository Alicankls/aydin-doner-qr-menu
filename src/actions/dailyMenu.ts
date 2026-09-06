"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { isDailyMenuAutoSoldOutActive, getIstanbulDateKey } from "@/lib/daily-menu-status";

export async function toggleDailyMenuAction(
  id: string,
  showInDailyMenu: boolean
): Promise<{ success: boolean }> {
  await requireAdmin();

  await prisma.product.update({
    where: { id },
    data: { showInDailyMenu },
  });

  revalidatePath("/admin/daily-menu");
  revalidatePath("/");
  revalidatePath("/gunun-menusu");
  revalidatePath("/menu");
  revalidatePath("/menu/gunun-menusu");
  return { success: true };
}

/**
 * Admin > Günün Menüsü ekranındaki Tükendi switch'i bunu çağırır. Ürünü
 * Tükendi yaparken her zaman override'ı temizler (manuel Tükendi kazanır);
 * satışa açarken, ürün gerçekten günün menüsündeyse ve o an 16:30 otomatik
 * kuralı aktifse, bugün için bir override bırakır — böylece otomatik kural
 * bu ürünü bugün görmezden gelir. Ertesi gün tarih eşleşmediği için
 * override kendiliğinden geçersiz olur.
 */
export async function setDailyMenuSoldOutAction(
  id: string,
  soldOut: boolean
): Promise<{ success: boolean }> {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { success: false };

  const dailyMenuOverrideDate = soldOut
    ? null
    : product.showInDailyMenu && isDailyMenuAutoSoldOutActive()
      ? getIstanbulDateKey()
      : null;

  await prisma.product.update({
    where: { id },
    data: { isSoldOut: soldOut, dailyMenuOverrideDate },
  });

  revalidatePath("/admin/daily-menu");
  revalidatePath("/");
  revalidatePath("/gunun-menusu");
  revalidatePath("/menu");
  revalidatePath("/menu/gunun-menusu");
  return { success: true };
}
