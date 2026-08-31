import { getSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hakkımızda",
  description:
    "Aydın Döner'in hikayesi: Çorlu/Tekirdağ'da 10 yılı aşkın süredir hizmet veren aile işletmesi.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">Hakkımızda</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-charcoal">
        {settings.businessName}
      </h1>

      <div className="mt-8 space-y-5 leading-relaxed text-secondary-text">
        {settings.aboutText ? (
          <p>{settings.aboutText}</p>
        ) : (
          <p>
            10 yılı aşkın süredir Çorlu&apos;da hizmet veren aile işletmemizde,
            günlük taze yemekler ve el yapımı döner ile misafirlerimizi
            ağırlıyoruz.
          </p>
        )}
        {settings.workingHours && (
          <p className="rounded-2xl border border-border-soft bg-warm-cream/60 p-5">
            <strong className="text-charcoal">Çalışma Saatleri:</strong>{" "}
            {settings.workingHours}
          </p>
        )}
      </div>
    </div>
  );
}
