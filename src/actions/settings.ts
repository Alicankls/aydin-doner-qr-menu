"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { put } from "@vercel/blob";

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
    revalidatePath("/iletisim");
    revalidatePath("/menu");
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

  const ext = (file.name.match(/\.([^.]+)$/)?.[1] ?? "jpg").toLowerCase();
  const filename = `logo/${crypto.randomUUID()}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/menu");
  return { success: true, url: blob.url };
}