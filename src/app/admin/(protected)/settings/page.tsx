import { getSiteSettings } from "@/lib/data/settings";
import { SettingsFormWrapper } from "@/components/admin/settings-form";

export const metadata = {
  title: "Ayarlar | Aydın Döner Menü Yönetim",
};

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal font-display">İşletme Ayarları</h1>
        <p className="text-sm text-secondary-text">
          İşletme bilgileri, iletişim ve sosyal medya bağlantıları.
        </p>
      </div>
      <SettingsFormWrapper settings={settings} />
    </div>
  );
}
