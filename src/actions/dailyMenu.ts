"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

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
  return { success: true };
}
