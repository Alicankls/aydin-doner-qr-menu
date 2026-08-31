"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";

export type SettingsFormState =
  | { status: "error"; message: string }
  | { status: "ok" };

export async function updateSiteSettingsAction(
  state: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    businessName: formData.get("businessName"),
    tagline: formData.get("tagline"),
    logoUrl: formData.get("logoUrl") ?? "",
    phone: formData.get("phone") ?? undefined,
    whatsapp: formData.get("whatsapp") ?? undefined,
    address: formData.get("address") ?? undefined,
    workingHours: formData.get("workingHours") ?? undefined,
    instagram: formData.get("instagram") ?? undefined,
    facebook: formData.get("facebook") ?? undefined,
    tiktok: formData.get("tiktok") ?? undefined,
    themeColor: formData.get("themeColor") ?? "",
    aboutText: formData.get("aboutText") ?? undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const data: SiteSettingsInput = parsed.data;

  try {
    await prisma.siteSettings.updateMany({
      data: {
        businessName: data.businessName,
        tagline: data.tagline ?? null,
        logoUrl: data.logoUrl || null,
        phone: data.phone ?? null,
        whatsapp: data.whatsapp ?? null,
        address: data.address ?? null,
        workingHours: data.workingHours ?? null,
        instagram: data.instagram ?? null,
        facebook: data.facebook ?? null,
        tiktok: data.tiktok ?? null,
        themeColor: data.themeColor || "#B82F3D",
        aboutText: data.aboutText ?? null,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/hakkimizda");
    revalidatePath("/iletisim");
    return { status: "ok" };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bir hata oluştu.";
    return { status: "error", message };
  }
}

export async function uploadLogoAction(
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
  const dir = join(process.cwd(), "public", "uploads", "logo");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, filename), buffer);
  const url = `/uploads/logo/${filename}`;

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true, url };
}
