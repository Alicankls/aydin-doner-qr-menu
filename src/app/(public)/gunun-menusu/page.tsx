import { DailyMenuListing } from "@/components/public/daily-menu-listing";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Günün Menüsü",
  description:
    "Aydın Döner'de bugün hazırlanan çorba, ana yemek ve garnitürler. Günlük tabldot menümüzü inceleyin.",
};

export default function DailyMenuPage() {
  return <DailyMenuListing homeHref="/" homeLabel="Ana Sayfa" />;
}
