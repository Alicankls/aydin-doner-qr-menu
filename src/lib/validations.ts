import { z } from "zod";

const optionalString = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const loginSchema = z.object({
  email: z.string().min(1, "E-posta zorunludur").email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre zorunludur"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(60),
  order: z.coerce.number().int().min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı").max(100),
  code: optionalString.refine(
    (v) => (v ? v.length <= 30 : true),
    "Ürün kodu en fazla 30 karakter olmalı"
  ),
  categoryId: z.string().min(1, "Kategori seçmelisiniz"),
  price: z.coerce.number().min(0, "Fiyat 0 veya daha büyük olmalı"),
  shortDescription: z.string().max(200).optional().or(z.literal("")),
  longDescription: z.string().max(2000).optional().or(z.literal("")),
  calories: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .nullable(),
  allergenInfo: z.string().max(300).optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
  isSoldOut: z.boolean(),
  showInDailyMenu: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type ProductInput = z.infer<typeof productSchema>;

export const siteSettingsSchema = z.object({
  businessName: z.string().min(2, "İşletme adı zorunludur"),
  tagline: z.string().max(200).optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  workingHours: z.string().max(200).optional().or(z.literal("")),
  instagram: z.string().max(200).optional().or(z.literal("")),
  facebook: z.string().max(200).optional().or(z.literal("")),
  tiktok: z.string().max(200).optional().or(z.literal("")),
  themeColor: z.string().max(20).optional().or(z.literal("")),
  aboutText: z.string().max(2000).optional().or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
