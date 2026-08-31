import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { buildWhatsappLink, buildTelLink, buildMapsLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İletişim & Adres",
  description:
    "Aydın Döner'e ulaşın: telefon, WhatsApp, adres ve çalışma saatleri. Çorlu/Tekirdağ'da bizi ziyaret edin veya sipariş verin.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">İletişim</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-charcoal">Bize Ulaşın</h1>
      <p className="mt-3 text-secondary-text">
        Sorularınız ve siparişleriniz için bize her zaman ulaşabilirsiniz.
      </p>

      <div className="mt-8 grid gap-4">
        {settings.phone && (
          <a
            href={buildTelLink(settings.phone) ?? "#"}
            className="flex items-center gap-4 rounded-2xl border border-border-soft bg-warm-white p-5 shadow-sm transition hover:border-aydin-red"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aydin-red/10 text-aydin-red">
              <Phone className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-charcoal">Telefon</strong>
              <span className="text-sm text-secondary-text">{settings.phone}</span>
            </span>
          </a>
        )}

        {settings.whatsapp && (
          <a
            href={buildWhatsappLink(settings.whatsapp, "Merhaba!") ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border-soft bg-warm-white p-5 shadow-sm transition hover:border-aydin-red"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/10 text-[#1da851]">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-charcoal">WhatsApp</strong>
              <span className="text-sm text-secondary-text">{settings.whatsapp}</span>
            </span>
          </a>
        )}

        {settings.address && (
          <a
            href={buildMapsLink(settings.address) ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border-soft bg-warm-white p-5 shadow-sm transition hover:border-aydin-red"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aydin-red/10 text-aydin-red">
              <MapPin className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-charcoal">Adres</strong>
              <span className="text-sm text-secondary-text">{settings.address}</span>
            </span>
          </a>
        )}

        {settings.workingHours && (
          <div className="flex items-center gap-4 rounded-2xl border border-border-soft bg-warm-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aydin-red/10 text-aydin-red">
              <Clock className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-charcoal">Çalışma Saatleri</strong>
              <span className="text-sm text-secondary-text">{settings.workingHours}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
