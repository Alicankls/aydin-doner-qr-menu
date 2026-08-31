"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  updateSiteSettingsAction,
  type SettingsFormState,
} from "@/actions/settings";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastProvider, useToast } from "@/components/ui/toast";

type Settings = {
  id: string;
  businessName: string;
  tagline: string | null;
  logoUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  workingHours: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  themeColor: string;
  aboutText: string | null;
};

export function SettingsFormWrapper({ settings }: { settings: Settings }) {
  return (
    <ToastProvider>
      <Inner settings={settings} />
    </ToastProvider>
  );
}

function Inner({ settings }: { settings: Settings }) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      businessName: settings.businessName,
      tagline: settings.tagline ?? "",
      logoUrl: settings.logoUrl ?? "",
      phone: settings.phone ?? "",
      whatsapp: settings.whatsapp ?? "",
      address: settings.address ?? "",
      workingHours: settings.workingHours ?? "",
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      tiktok: settings.tiktok ?? "",
      themeColor: settings.themeColor ?? "#B82F3D",
      aboutText: settings.aboutText ?? "",
    },
  });

  const onSubmit = (data: SiteSettingsInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.set(key, String(value));
    });

    startTransition(async () => {
      const result: SettingsFormState = await updateSiteSettingsAction(
        undefined,
        formData
      );
      if (result.status === "ok") {
        addToast("Ayarlar kaydedildi.", "success");
      } else {
        addToast(result.message, "error");
      }
    });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Genel */}
      <section className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Genel</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="İşletme Adı *" error={errors.businessName?.message}>
            <Input {...register("businessName")} />
          </Field>
          <Field label="Slogan" error={errors.tagline?.message}>
            <Input {...register("tagline")} placeholder="Kısa ve dikkat çekici bir cümle" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Hakkımızda Metni" error={errors.aboutText?.message}>
            <Textarea {...register("aboutText")} rows={4} />
          </Field>
        </div>
      </section>

      {/* İletişim */}
      <section className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">İletişim</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="0282 xxx xx xx" />
          </Field>
          <Field label="WhatsApp Numarası" error={errors.whatsapp?.message}>
            <Input {...register("whatsapp")} placeholder="05xx xxx xx xx" />
          </Field>
          <Field label="Adres" error={errors.address?.message}>
            <Textarea {...register("address")} rows={2} />
          </Field>
          <Field label="Çalışma Saatleri" error={errors.workingHours?.message}>
            <Input {...register("workingHours")} placeholder="Her gün 09:00 - 22:00" />
          </Field>
        </div>
      </section>

      {/* Sosyal Medya */}
      <section className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Sosyal Medya</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Instagram" error={errors.instagram?.message}>
            <Input {...register("instagram")} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="Facebook" error={errors.facebook?.message}>
            <Input {...register("facebook")} placeholder="https://facebook.com/..." />
          </Field>
          <Field label="TikTok" error={errors.tiktok?.message}>
            <Input {...register("tiktok")} placeholder="https://tiktok.com/@..." />
          </Field>
        </div>
      </section>

      {/* Tema & Logo */}
      <section className="rounded-xl border border-border-soft bg-warm-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Tema</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Logo URL"
            error={errors.logoUrl?.message}
            hint="Boş bırakılırsa işletme adı yazıyla gösterilir."
          >
            <Input {...register("logoUrl")} placeholder="/uploads/logo/logo.png" />
          </Field>
          <Field label="Tema Rengi" error={errors.themeColor?.message}>
            <Input {...register("themeColor")} placeholder="#B82F3D" />
          </Field>
        </div>
      </section>

      <Button type="submit" disabled={isPending} size="lg" variant="primary">
        {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-secondary-text">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
