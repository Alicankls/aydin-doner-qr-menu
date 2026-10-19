import { getSiteSettings, getDailyMenuProducts, getActiveCategoriesWithActiveProducts } from "@/lib/data/home";
import { RestaurantJsonLd } from "@/components/public/restaurant-json-ld";
import { CinematicHome } from "@/components/home/cinematic-home";
import { HomeAbout } from "@/components/home/home-about";
import { HomeMenu } from "@/components/home/home-menu";
import { HomeContact } from "@/components/home/home-contact";
import { buildWhatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aydın Döner | Çorlu",
  description:
    "Çorlu'da döner, günlük tabldot yemekler ve ev usulü lezzetler. Günün menüsünü görün, WhatsApp'tan sipariş verin veya paket servis için bizi arayın.",
};

export default async function HomePage() {
  const [settings, dailyMenu, categories] = await Promise.all([
    getSiteSettings(),
    getDailyMenuProducts(),
    getActiveCategoriesWithActiveProducts(),
  ]);

  const whatsappHref = buildWhatsappLink(settings.whatsapp, "Merhaba, sipariş vermek istiyorum.");

  return (
    <>
      <RestaurantJsonLd settings={settings} />
      <CinematicHome
        businessName={settings.businessName}
        logoUrl={settings.logoUrl}
        subtitle="Çorlu'nun 10 yılı aşkın döner ustası"
        workingHours={settings.workingHours}
        whatsappHref={whatsappHref}
      >
        <HomeAbout />
        <HomeMenu dailyMenu={dailyMenu} categories={categories} />
        <HomeContact settings={settings} />
      </CinematicHome>
    </>
  );
}
