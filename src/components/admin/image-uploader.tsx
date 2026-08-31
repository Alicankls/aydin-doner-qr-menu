"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { uploadProductImageAction } from "@/actions/products";
import { useToast } from "@/components/ui/toast";

export function ImageUploader({
  value,
  onChange,
  folder = "products",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast("Lütfen bir görsel dosyası seçin.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast("Görsel boyutu en fazla 5MB olabilir.", "error");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const res =
        folder === "logo"
          ? await import("@/actions/settings").then((m) =>
              m.uploadLogoAction(formData)
            )
          : await uploadProductImageAction(formData);
      if (res.success && res.url) {
        onChange(res.url);
        addToast("Görsel yüklendi.", "success");
      } else {
        addToast(res.message ?? "Yükleme başarısız.", "error");
      }
    });
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative h-32 w-48">
          <Image
            src={value}
            alt="Önizleme"
            fill
            sizes="192px"
            className="rounded-lg border border-border-soft object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md border border-border-soft"
            aria-label="Görseli kaldır"
          >
            <X className="h-3.5 w-3.5 text-secondary-text" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border-soft text-secondary-text transition hover:border-aydin-red/50 hover:text-aydin-red-dark"
        >
          <UploadCloud className={`h-6 w-6 ${isPending ? "animate-pulse" : ""}`} />
          <span className="text-sm">
            {isPending ? "Yükleniyor..." : "Görsel yüklemek için tıklayın"}
          </span>
        </button>
      )}
      <p className="text-xs text-secondary-text">
        PNG, JPG veya WEBP. En fazla 5MB.
      </p>
    </div>
  );
}
