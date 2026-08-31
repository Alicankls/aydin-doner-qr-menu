import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
    locale: "tr",
  });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function buildWhatsappLink(
  phone: string | null | undefined,
  message?: string
) {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  const normalized = digits.startsWith("90")
    ? digits
    : `90${digits.replace(/^0/, "")}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${text}`;
}

export function buildTelLink(phone: string | null | undefined) {
  if (!phone) return null;
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function buildMapsLink(address: string | null | undefined) {
  if (!address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}
