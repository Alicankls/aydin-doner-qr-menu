import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { buildTelLink, buildWhatsappLink, GOOGLE_MAPS_URL } from "@/lib/utils";

type Settings = {
  businessName: string;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  workingHours: string | null;
};

export function HomeContact({ settings }: { settings: Settings }) {
  const wa = buildWhatsappLink(settings.whatsapp, "Merhaba, sipariş vermek istiyorum.");
  const tel = buildTelLink(settings.phone);

  return (
    <>
      <section id="iletisim" className="cine-solid cine-contact">
        <div className="cine-wrap">
          <p className="cine-tag">Bizi bul</p>
          <h2 className="cine-h2">Gel, otur, ye.</h2>

          <dl className="cine-contact-grid">
            {settings.address && (
              <div>
                <dt>
                  <MapPin aria-hidden="true" className="h-4 w-4" /> Adres
                </dt>
                <dd>{settings.address}</dd>
              </div>
            )}
            {settings.workingHours && (
              <div>
                <dt>
                  <Clock aria-hidden="true" className="h-4 w-4" /> Saatler
                </dt>
                <dd>{settings.workingHours}</dd>
              </div>
            )}
            {settings.phone && tel && (
              <div>
                <dt>
                  <Phone aria-hidden="true" className="h-4 w-4" /> Telefon
                </dt>
                <dd>
                  <a href={tel}>{settings.phone}</a>
                </dd>
              </div>
            )}
            {settings.whatsapp && wa && (
              <div>
                <dt>
                  <MessageCircle aria-hidden="true" className="h-4 w-4" /> WhatsApp
                </dt>
                <dd>
                  <a href={wa} target="_blank" rel="noopener noreferrer">
                    {settings.whatsapp}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div className="cine-actions">
            {settings.address && (
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cine-btn cine-btn-red"
              >
                <MapPin aria-hidden="true" className="h-4 w-4" />
                Yol Tarifi Al
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="cine-btn cine-btn-light"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp&apos;tan Sipariş Ver
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="cine-solid cine-footer">
        © {new Date().getFullYear()} {settings.businessName}. Tüm hakları saklıdır.
      </footer>
    </>
  );
}
