import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { buildWhatsappLink, buildTelLink, GOOGLE_MAPS_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

const WORKING_HOURS: { day: string; hours: string; closed?: boolean }[] = [
  { day: "Pazartesi", hours: "08:00 - 17:00" },
  { day: "Salı", hours: "08:00 - 17:00" },
  { day: "Çarşamba", hours: "08:00 - 17:00" },
  { day: "Perşembe", hours: "08:00 - 17:00" },
  { day: "Cuma", hours: "08:00 - 17:00" },
  { day: "Cumartesi", hours: "08:00 - 17:00" },
  { day: "Pazar", hours: "Kapalı", closed: true },
];

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
            href={GOOGLE_MAPS_URL}
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

        <div className="flex items-start gap-4 rounded-2xl border border-border-soft bg-warm-white p-5 shadow-sm">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-aydin-red/10 text-aydin-red">
            <Clock className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-charcoal">Çalışma Saatleri</strong>
            <ul className="mt-2 divide-y divide-border-soft">
              {WORKING_HOURS.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center justify-between gap-3 py-1.5 text-sm"
                >
                  <span className="text-secondary-text">{row.day}</span>
                  <span
                    className={
                      row.closed
                        ? "font-bold uppercase tracking-wide text-aydin-red-dark"
                        : "font-medium text-charcoal"
                    }
                  >
                    {row.hours}
                  </span>
                </li>
              ))}
            </ul>
          </span>
        </div>
      </div>
    </div>
  );
}
