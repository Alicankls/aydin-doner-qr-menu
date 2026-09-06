import { getSiteSettings } from "@/lib/data/settings";
import { getActiveCategoriesWithActiveProducts } from "@/lib/data/categories";
import { SiteProvider } from "@/components/public/site-provider";
import { SiteHeader, SiteFooter, FloatingWhatsApp } from "@/components/public/site-chrome";

export default async function MenuLayout({ children }: LayoutProps<"/menu">) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getActiveCategoriesWithActiveProducts(),
  ]);

  return (
    <SiteProvider settings={settings} categories={categories}>
      <div className="flex min-h-screen flex-col bg-warm-white text-charcoal">
        <SiteHeader variant="qr" />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <FloatingWhatsApp />
      </div>
    </SiteProvider>
  );
}
